import { ArrowUpRight } from 'lucide-react'

const currentYear = new Date().getFullYear()

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-main">
        <a className="brand footer-brand" href="#hero" aria-label="Nexora home">
          <span className="brand-mark">n<span>.</span></span>
          <span className="brand-name">nexora<span>®</span></span>
        </a>
        <p>Technology, with a little more<br />human in it.</p>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#faq">FAQ</a>
          <a href="mailto:hello@nexora.example">Email us <ArrowUpRight size={14} /></a>
        </div>
        <a className="back-to-top" href="#hero">Back to top ↑</a>
      </div>
      <div className="page-shell footer-bottom">
        <span>© {currentYear} Nexora Technologies. Made with intention.</span>
        <span>Independent by nature. Better together.</span>
      </div>
    </footer>
  )
}

export default Footer
