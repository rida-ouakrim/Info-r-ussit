import re
import sys
import urllib.request

sys.stdout.reconfigure(encoding='utf-8')

c_urls = [
    "https://drive.google.com/file/d/10OsfOvMH4QEVQzH_XZHzHNvCfUPUOO1G/view?usp=sharing",
    "https://drive.google.com/file/d/11qv9EcFSZ4OrU3Z078StRlWqKXVfMyyP/view?usp=sharing",
    "https://drive.google.com/file/d/16O0ZJpMErOp4WWJ4pihUY3x3QJ4GhOOT/view?usp=sharing",
    "https://drive.google.com/file/d/19XU-byEYF5OPDQDwGKQ8JkCerQ8dCsTD/view?usp=sharing",
    "https://drive.google.com/file/d/1CrNM4eNGtH2LUKP57WezfFaB6XeJGFtA/view?usp=sharing",
    "https://drive.google.com/file/d/1D0c5gopO0Xv9HQUP2fJh9LeBsUBVwTA5/view?usp=sharing",
    "https://drive.google.com/file/d/1DZ8szSNoGv3jbnlGRACN_imPt-0ts5ER/view?usp=sharing",
    "https://drive.google.com/file/d/1Dv8FemMpvYRF7PwQ0tYi3OUMpa5RvWu8/view?usp=sharing",
    "https://drive.google.com/file/d/1FS3J2Fhlz1NsQuXcMDSRKB6uk50XbRWv/view?usp=sharing",
    "https://drive.google.com/file/d/1GYqV_KKnnxpVrrpGDEcFXPClNQknxolT/view?usp=sharing",
    "https://drive.google.com/file/d/1H3rDkRgB1I193xnEZMu77vzcJ64K-FAp/view?usp=sharing",
    "https://drive.google.com/file/d/1HiVOm7WNhM8imjkWa0XsHYHSJCSn4SQC/view?usp=sharing",
    "https://drive.google.com/file/d/1K2pSKBEHYE5V6dGUe6WxvYyKN31Em5u2/view?usp=sharing",
    "https://drive.google.com/file/d/1KPdg7aeFAfUfvajLRmSfTCXaK0beRRq8/view?usp=sharing",
    "https://drive.google.com/file/d/1LxIdkU541_A47h05S7kgAb1TSOoKpp03/view?usp=sharing",
    "https://drive.google.com/file/d/1NQovbWgSkKBnpn02rpG79xp_9EyhHKui/view?usp=sharing",
    "https://drive.google.com/file/d/1NkTHJLlIJIJFvy0BGI7BIHO5zkPJIiyi/view?usp=sharing",
    "https://drive.google.com/file/d/1P7DoImgFR4dMZYcDQRdrwav4B66QWSJS/view?usp=sharing",
    "https://drive.google.com/file/d/1QhI8vSIiA7GMctwcSvhFEkM9qXijwy60/view?usp=sharing",
    "https://drive.google.com/file/d/1R9X_orGCJkHNgvMja5i3OGrMBjVstoaR/view?usp=sharing",
    "https://drive.google.com/file/d/1T1KH8LRC_70yP9dz-PwlF3zg_hoyCkHp/view?usp=sharing",
    "https://drive.google.com/file/d/1WmdkSVLm77-IxpUf-o1-O89kyY2X181g/view?usp=sharing",
    "https://drive.google.com/file/d/1XSuqEJFwgG4Nlv7th_ICL2-5dVHF0Nv3/view?usp=sharing",
    "https://drive.google.com/file/d/1YyegJp4Ny4j2aIxRgG9jBD99ov4ttuyg/view?usp=sharing",
    "https://drive.google.com/file/d/1_26DzhIlhx9Ah7S-UOi28E4X2jzpoBWf/view?usp=sharing",
    "https://drive.google.com/file/d/1_ivpBDZbZpQT5RSp4O31b2S3i5CZsxmU/view?usp=sharing",
    "https://drive.google.com/file/d/1aCroqgQJVwT6boOhoX4lGVKLvf5KJpjo/view?usp=sharing",
    "https://drive.google.com/file/d/1aj3KAY-ISZK-xY9iipxkSdObwYW_CVbB/view?usp=sharing",
    "https://drive.google.com/file/d/1bWftn086PRxJBuS48bYMP74kgPVU54D2/view?usp=sharing",
    "https://drive.google.com/file/d/1bYP7YwwedbFXCF7KOCpwvr-wAKOkIINo/view?usp=sharing",
    "https://drive.google.com/file/d/1coDVemjVL9QsLllE3qN7mgu808zHDVMu/view?usp=sharing",
    "https://drive.google.com/file/d/1ct98571qoTDf8wNQlOMhLjq6nil4sujB/view?usp=sharing",
    "https://drive.google.com/file/d/1d-KIyr8Lm2hmHHY0ZAQFLjXGrOMcqFTg/view?usp=sharing",
    "https://drive.google.com/file/d/1dSWvy64guEpxdQ45JF48Co3mGaudItZp/view?usp=sharing",
    "https://drive.google.com/file/d/1fndp30xztb4jCGlH7Nit7YaDSyLwn1nE/view?usp=sharing",
    "https://drive.google.com/file/d/1fv07kzrgM53DA34EghPdE1yq37XjpuiY/view?usp=sharing",
    "https://drive.google.com/file/d/1hXZ35lSPhgy842ODFq-qgPcXVrfBLyBr/view?usp=sharing",
    "https://drive.google.com/file/d/1i_kV0YtUuVNHuTA8Ys04rD4s_abaoib5/view?usp=sharing",
    "https://drive.google.com/file/d/1j9IvCelN3ZpPvEi_4UfLcsrck_A3lDuu/view?usp=sharing",
    "https://drive.google.com/file/d/1ll2-7jCdBvMAYYweGFV6L6CGBeuPRIjI/view?usp=sharing",
    "https://drive.google.com/file/d/1oETO6276mUuQmjwoLQB5LfKWvc_wLTd9/view?usp=sharing",
    "https://drive.google.com/file/d/1ocqu_6J9740PhWXwwwm4AaR9nvgkCJxN/view?usp=sharing",
    "https://drive.google.com/file/d/1rLmbhSTkHd33Mkx1paes53iUKVqEubTV/view?usp=sharing",
    "https://drive.google.com/file/d/1sJnqxjo3loh74hmFHg4-Au4km81TcHkD/view?usp=sharing",
    "https://drive.google.com/file/d/1t0dsFTVKHDGr2JpIkAMiGsXGvoxnVbSY/view?usp=sharing",
    "https://drive.google.com/file/d/1tOmtZjuxt0Ztb6PCD9qgMobCD5AjTwFE/view?usp=sharing",
    "https://drive.google.com/file/d/1tkNRVOeQes_6nb16a6za_o019yE3Q3F1/view?usp=sharing",
    "https://drive.google.com/file/d/1y6h2s4-sHxlBGyjY1aoiK8SSdYvpc8nH/view?usp=sharing",
    "https://drive.google.com/file/d/1zNKsxotHT05IG9TT8z3hKS2ixY4xW8_U/view?usp=sharing",
    "https://drive.google.com/file/d/1zs2aRRCT0Q3o4cx1QshnWh6MBO0LnhHo/view?usp=sharing"
]

req_headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print(f"Fetching titles for {len(c_urls)} C language videos...\n")
c_video_data = []

for idx, url in enumerate(c_urls, 1):
    try:
        req = urllib.request.Request(url, headers=req_headers)
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
            title = title_match.group(1) if title_match else 'Unknown'
            title = title.replace(' - Google Drive', '').strip()
            print(f"[{idx:02d}] {title} | {url}")
            c_video_data.append({'index': idx, 'title': title, 'url': url})
    except Exception as e:
        print(f"[{idx:02d}] Error: {e} | {url}")

print("\nDone fetching all titles!")
