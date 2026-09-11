import os
import re
import mimetypes
import requests as http_requests
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.http import HttpResponse, Http404, FileResponse, StreamingHttpResponse


def serve_media_range(request, path):
    file_path = os.path.join(settings.MEDIA_ROOT, path)
    if not os.path.exists(file_path) or not os.path.isfile(file_path):
        raise Http404("Media file not found")

    file_size = os.path.getsize(file_path)
    content_type, _ = mimetypes.guess_type(file_path)
    content_type = content_type or 'video/mp4'

    range_header = request.META.get('HTTP_RANGE', '').strip()
    if range_header:
        match = re.search(r'bytes=(\d+)-(\d*)', range_header)
        if match:
            start = int(match.group(1))
            end = int(match.group(2)) if match.group(2) else file_size - 1
            if end >= file_size:
                end = file_size - 1
            length = end - start + 1

            with open(file_path, 'rb') as f:
                f.seek(start)
                data = f.read(length)

            response = HttpResponse(data, status=206, content_type=content_type)
            response['Content-Range'] = f'bytes {start}-{end}/{file_size}'
            response['Accept-Ranges'] = 'bytes'
            response['Content-Length'] = str(length)
            return response

    response = FileResponse(open(file_path, 'rb'), content_type=content_type)
    response['Accept-Ranges'] = 'bytes'
    response['Content-Length'] = str(file_size)
    return response


def proxy_drive_video(request):
    """
    Proxies a Google Drive video to the browser, bypassing CSP/CORS restrictions.
    Usage: GET /api/proxy/drive-video/?id=GOOGLE_DRIVE_FILE_ID
    The file must be shared publicly ("Anyone with the link can view").
    """
    file_id = request.GET.get('id', '').strip()
    if not file_id or not re.match(r'^[a-zA-Z0-9_-]+$', file_id):
        return HttpResponse('Missing or invalid Google Drive file ID.', status=400)

    session = http_requests.Session()

    # Forward Range header from the browser for seek/timeline support
    range_header = request.META.get('HTTP_RANGE', '')
    upstream_headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
    }
    if range_header:
        upstream_headers['Range'] = range_header

    # Step 1: Try the usercontent direct download endpoint
    drive_url = (
        f'https://drive.usercontent.google.com/download'
        f'?id={file_id}&export=download&authuser=0&confirm=t'
    )

    try:
        r = session.get(drive_url, headers=upstream_headers, stream=True,
                        timeout=(8, 60), allow_redirects=True)
    except http_requests.exceptions.Timeout:
        return HttpResponse('Drive request timed out.', status=504)
    except Exception as exc:
        return HttpResponse(f'Upstream error: {exc}', status=502)

    # Step 2: If Google returned an HTML page (virus/size confirmation), extract the real URL
    content_type_upstream = r.headers.get('Content-Type', '')
    if 'text/html' in content_type_upstream and r.status_code == 200:
        # Parse the confirmation token from the HTML and retry
        html = r.content.decode('utf-8', errors='replace')
        # Look for the download warning form action or direct link
        import re as _re
        token_match = _re.search(r'confirm=([0-9A-Za-z_-]+)', html)
        uuid_match = _re.search(r'uuid=([0-9A-Za-z_-]+)', html)
        if token_match or uuid_match:
            confirm = token_match.group(1) if token_match else 't'
            uuid = uuid_match.group(1) if uuid_match else ''
            retry_url = (
                f'https://drive.usercontent.google.com/download'
                f'?id={file_id}&export=download&authuser=0'
                f'&confirm={confirm}&uuid={uuid}'
            )
            try:
                r = session.get(retry_url, headers=upstream_headers, stream=True,
                                timeout=(8, 60), allow_redirects=True)
            except Exception as exc:
                return HttpResponse(f'Retry upstream error: {exc}', status=502)
        else:
            # Fallback: try legacy export URL
            fallback_url = (
                f'https://drive.google.com/uc'
                f'?id={file_id}&export=download&confirm=t'
            )
            try:
                r = session.get(fallback_url, headers=upstream_headers, stream=True,
                                timeout=(8, 60), allow_redirects=True)
            except Exception as exc:
                return HttpResponse(f'Fallback upstream error: {exc}', status=502)

    if r.status_code not in (200, 206):
        return HttpResponse(f'Drive returned {r.status_code}', status=r.status_code)

    final_content_type = r.headers.get('Content-Type', 'video/mp4')
    # Ensure we always respond as video, not HTML
    if 'text/html' in final_content_type:
        final_content_type = 'video/mp4'

    status_code = r.status_code

    def stream():
        # 512 KB chunks — good balance between memory and throughput
        for chunk in r.iter_content(chunk_size=512 * 1024):
            if chunk:
                yield chunk

    response = StreamingHttpResponse(stream(), content_type=final_content_type, status=status_code)
    response['Accept-Ranges'] = 'bytes'
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Headers'] = 'Range'
    response['Cache-Control'] = 'public, max-age=86400'  # Cache 24h in browser

    for hdr in ('Content-Length', 'Content-Range', 'Content-Disposition'):
        if hdr in r.headers:
            response[hdr] = r.headers[hdr]

    return response


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/', include('syllabus.urls')),
    path('api/', include('exams.urls')),
    path('api/ai/', include('ai_assistant.urls')),
    path('api/proxy/drive-video/', proxy_drive_video),
    re_path(r'^media/(?P<path>.*)$', serve_media_range),
]

