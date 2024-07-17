#!/bin/bash

echo "Updating package list..."
sudo apt update

echo "Installing Tesseract OCR and its English language pack..."
sudo apt install -y tesseract-ocr tesseract-ocr-eng

echo "Installing Python packages: pytesseract and openpyxl..."
pip install pytesseract openpyxl

echo "Installation complete."
