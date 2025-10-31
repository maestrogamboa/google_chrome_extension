# Doomify

Doomify is a Chrome extension that converts long webpage content into short, scrollable summaries presented in a side panel. It lets you choose a **tone** and quickly digest information without reading the full article.

---

## Features

* **Summarizes** long articles into quick, readable segments. 📝
* **Side panel view** allows comparison with the original text.
* **Tone selector** to change the style of the summary (e.g., "fast-paced," "dramatic," "punchy").
* Works on **any webpage** you choose.

---

## Installation

### Installation: Project Setup

1.  **Clone or download** the repository to your local machine:

    ```bash
    git clone https://github.com/maestrogamboa/doomify-extension.git
    cd doomify-extension
    ```

2.  **Install dependencies** (This command reads the project's `package.json` file to install all necessary packages):

    ```bash
    npm install
    # OR
    # yarn install
    ```

### Installation: Chrome Setup

To load Doomify in your browser:

1.  Open Chrome and go to the Extensions page:

    ```
    chrome://extensions/
    ```

2.  Toggle on **Developer mode** (top right).

3.  Click the **Load unpacked** button.

4.  Select the **root directory of the cloned repository** (the `doomify-extension` folder itself, which contains the `manifest.json` file).

✅ The extension will now appear in your browser toolbar.

---

## Usage

1.  Navigate to an article or webpage you want summarized.
2.  Click the **Doomify extension icon**.
3.  Choose a **tone** you'd like the summary to take.
4.  Click **Feed Me**.
5.  Your scrollable, punchy summary will appear in the side panel.

---

## Permissions

| Permission | Purpose |
| :--- | :--- |
| `sidePanel` | Displays the summarized output alongside the current page. |
| `activeTab` | Allows the extension to read content from the page you're currently viewing. |
| `tabs` | Identifies which tab is being summarized. |
| `scripting` | Injects a script to extract text for processing. |

**Privacy Note:** No data is collected or sent anywhere. All processing happens locally in your browser.