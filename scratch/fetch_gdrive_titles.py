import re
import sys
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

urls = [
    "https://drive.google.com/file/d/1-1W28JSIac6e78KKmPNP2c0ap9Ya9CL7/view?usp=sharing",
    "https://drive.google.com/file/d/1MyGBpXV2QV4FhOX4t3Gj1w0Rs9g6Avnz/view?usp=sharing",
    "https://drive.google.com/file/d/1PGuOyz-zmtHJldM64inXIpxW_tWdZZ3A/view?usp=sharing",
    "https://drive.google.com/file/d/1Pfc-i8sqKCMJ8iSVsK_v1uMowZXbXYgy/view?usp=sharing",
    "https://drive.google.com/file/d/1R3WVJqOByTBl9OL2UG4jrSuhDVdADfJN/view?usp=sharing",
    "https://drive.google.com/file/d/1Vs9hi4x451Vx5hVSGqnLt2VTfvC_niCm/view?usp=sharing",
    "https://drive.google.com/file/d/1XWJ2qHZFsjdTq87IrvOgeKn54zRQUSTB/view?usp=sharing",
    "https://drive.google.com/file/d/1g8aDWeWbEbObQCFE7eUdyUsXqddIuCd0/view?usp=sharing",
    "https://drive.google.com/file/d/1kAv1rPoAAjXEhCPTkf3v6xajRP7JUADL/view?usp=sharing",
    "https://drive.google.com/file/d/1nztnVKBD8n7NImMQOI87ZRycU-0Aw1rS/view?usp=sharing",
    "https://drive.google.com/file/d/1p7ui66rjrnGiu9FPWso4iIzIVecJSEor/view?usp=sharing",
    "https://drive.google.com/file/d/1r4xl_LTBaEITa4plAUEGVxfdAK4YGT6t/view?usp=sharing",
    "https://drive.google.com/file/d/1vIQJKqwnQ8GcinNHDygneOydAAKSYWRd/view?usp=sharing",
    "https://drive.google.com/file/d/1voTOC1NW_YsBNNo8wtrKJo7lPbIfd1rc/view?usp=sharing",
]

req_headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

for idx, url in enumerate(urls, 1):
    try:
        req = urllib.request.Request(url, headers=req_headers)
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
            title = title_match.group(1) if title_match else 'Unknown'
            # Clean Google Drive suffix
            title = title.replace(' - Google Drive', '').strip()
            print(f"Link {idx:02d}: {url}\n  -> Title: {title}\n")
    except Exception as e:
        print(f"Link {idx:02d}: {url}\n  -> Error: {e}\n")
