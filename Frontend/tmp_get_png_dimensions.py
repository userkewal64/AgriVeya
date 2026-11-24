import os, struct, sys
base = r'C:/Users/techz/.gemini/antigravity/brain/826681da-dd96-45e1-bd3b-b9e818836e7e/.user_uploaded'
for fname in os.listdir(base):
    if not fname.lower().endswith('.png'):
        continue
    path = os.path.join(base, fname)
    try:
        with open(path, 'rb') as f:
            sig = f.read(8)
            if sig != b'\x89PNG\r\n\x1a\n':
                print(f'{fname}: not a PNG')
                continue
            # Read chunks until IHDR
            while True:
                chunk = f.read(8)
                if len(chunk) < 8:
                    break
                length, chunk_type = struct.unpack('>I4s', chunk)
                if chunk_type == b'IHDR':
                    data = f.read(length)
                    width, height = struct.unpack('>II', data[:8])
                    print(f'{fname}: {width}x{height}')
                    break
                else:
                    f.seek(length + 4, 1)  # skip data + CRC
    except Exception as e:
        print(f'{fname}: error {e}')
