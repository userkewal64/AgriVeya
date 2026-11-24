import os, struct, shutil

# Paths
src_icon = r'C:/Users/techz/.gemini/antigravity/brain/826681da-dd96-45e1-bd3b-b9e818836e7e/.user_uploaded/media_1795520110463_ec9a40d5.png'
frontend_dir = r'C:/Users/techz/Desktop/First Step/AgriVeya/Frontend'

# Destination files
favicon_png = os.path.join(frontend_dir, 'favicon-64.png')
favicon_ico = os.path.join(frontend_dir, 'favicon.ico')

# Copy the original 64x64 PNG unchanged
shutil.copyfile(src_icon, favicon_png)

# Read PNG data
with open(favicon_png, 'rb') as f:
    png_data = f.read()

# Build a simple ICO containing a single PNG entry (64x64)
# ICONDIR (6 bytes): reserved=0, type=1 (icon), count=1
icon_dir = struct.pack('<HHH', 0, 1, 1)
# ICONDIRENTRY (16 bytes): width, height, colorCount, reserved, planes, bitCount, bytesInRes, imageOffset
# width/height: 64 (0 means 256). Use 64.
width = 64
height = 64
color_count = 0
reserved = 0
planes = 1
bit_count = 32
bytes_in_res = len(png_data)
image_offset = 6 + 16  # after header and entry
entry = struct.pack('<BBBBHHII', width, height, color_count, reserved, planes, bit_count, bytes_in_res, image_offset)

with open(favicon_ico, 'wb') as f:
    f.write(icon_dir)
    f.write(entry)
    f.write(png_data)

print('Created favicon-64.png and favicon.ico')
