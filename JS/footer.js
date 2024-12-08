class CFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <style>
          .footer {
            background-color: #222;
            color: #fff;
            text-align: center;
            padding: 20px 10px;
            font-size: 14px;
          }
  
          .footer-links {
            margin-bottom: 10px;
          }
  
          .footer-links a {
            color: #aaa;
            text-decoration: none;
            margin: 0 10px;
            font-size: 14px;
          }
  
          .footer-links a:hover {
            color: #fff;
          }
  
          .footer-copy {
            margin-top: 10px;
            font-size: 12px;
            color: #777;
          }
        </style>
        <footer class="footer">
          <div class="footer-links">
            <a href="-privacy-policy.html">Privacy Policy</a>
            <a href="-terms-of-service.html">Terms of Service</a>
            <a href="about.html">About</a>
          </div>
          <p class="footer-copy">&copy; 2024 Shatter. All rights reserved.</p>
        </footer>
      `;
    }
}

// Define the custom footer component
customElements.define('c-footer', CFooter);