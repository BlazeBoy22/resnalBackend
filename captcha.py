import pytesseract
from PIL import Image, ImageFilter, ImageEnhance, ImageOps
import re

# Load the image
image_path = "cap.png"
image = Image.open(image_path)

# Preprocess the image
def preprocess_image(image):
    # Convert to grayscale
    gray_image = ImageOps.grayscale(image)
    
    # Enhance the image contrast
    enhancer = ImageEnhance.Contrast(gray_image)
    enhanced_image = enhancer.enhance(2)
    
    # Apply a median filter to reduce noise
    filtered_image = enhanced_image.filter(ImageFilter.MedianFilter(size=3))
    
    # Binarize the image
    threshold = 100
    binary_image = filtered_image.point(lambda p: p > threshold and 255)
    
    return binary_image

# Preprocess the image
processed_image = preprocess_image(image)

# Save the processed image (optional)
processed_image_path = "processed_image.png"
processed_image.save(processed_image_path)
# print(f"Processed image saved at: {processed_image_path}")

# Use pytesseract to do OCR on the processed image
captcha_text = pytesseract.image_to_string(processed_image, config='--psm 6').strip()

# Post-process to extract only alphanumeric characters
captcha_text_alphanumeric = re.sub(r'\W+', '', captcha_text)
# print(captcha_text_alphanumeric)

# Write the cleaned text to a new text file
output_text_file = "output.txt"
with open(output_text_file, 'w') as file:
    file.write(captcha_text_alphanumeric)

# print(f"Captcha text written to: {output_text_file}")
