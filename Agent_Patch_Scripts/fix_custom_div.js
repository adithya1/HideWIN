const fs = require('fs');
const path = require('path');
const p = path.join('C:', 'Users', 'akula', 'Downloads', 'Hide-WIN', 'Hide-Win-Master', 'src', 'components', 'views', 'AICustomizeView.js');
let text = fs.readFileSync(p, 'utf8');

text = text.replace("                    </div>\r\n                \r\n                <!-- Popup Focus Modal -->", "                    </div>\n                </div>\n                <!-- Popup Focus Modal -->");
text = text.replace("                    </div>\n                \n                <!-- Popup Focus Modal -->", "                    </div>\n                </div>\n                <!-- Popup Focus Modal -->");
fs.writeFileSync(p, text, 'utf8');
console.log("Fixed missing div in AICustomizeView.js!");
