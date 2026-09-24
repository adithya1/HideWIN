import os

p = r"C:\Users\akula\Downloads\Hide-WIN - Copy\Hide-Win-Web\src\pages\Admin.jsx"

with open(p, "r", encoding="utf-8") as f:
    text = f.read()

# Remove the broken duplicate imports
text = text.replace("import { Globe, useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';")
text = text.replace("import { Globe, useNavigate } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';")

# Make sure it's safely imported from lucide-react if not already
if "Globe" not in text.split("from 'lucide-react'")[0]:
    text = text.replace("} from 'lucide-react';", ", Globe } from 'lucide-react';")

with open(p, "w", encoding="utf-8") as f:
    f.write(text)

print("Fixed duplicate Globe imports")
