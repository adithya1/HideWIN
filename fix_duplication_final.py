import re

file_path = "services/web/src/pages/Admin.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

# The first `{/* BRANDING & LOGOS */}` is at the start of the first settings block.
# The second `{/* BRANDING & LOGOS */}` is at the start of the duplicated settings block.
branding_parts = text.split("{/* BRANDING & LOGOS */}")

# We want to KEEP branding_parts[0] and branding_parts[1].
# branding_parts[1] ends just before the second `{/* BRANDING & LOGOS */}`.
# We discard the rest of branding_parts, EXCEPT we need the closing tags and the modal.

modal_parts = text.split("{/* Global Modal Overlay */}")
modal_and_after = "{/* Global Modal Overlay */}" + modal_parts[1]

# What are the exact closing tags?
closing_tags = """
            </div>
          </div>
        )}

      </main>

      """

new_text = branding_parts[0] + "{/* BRANDING & LOGOS */}" + branding_parts[1] + closing_tags + modal_and_after

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_text)

print("Removed duplicated settings block from Admin.jsx!")
