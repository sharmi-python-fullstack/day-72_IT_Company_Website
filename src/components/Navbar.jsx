import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const links = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
]

function Navbar({ onOpenChat }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <header className="site-header">
      <nav className="page-shell navbar" aria-label="Main navigation">
        <a className="brand" href="#hero" onClick={closeMenu} aria-label="Nexora home">
          <span className="brand-mark">n<span>.</span></span>
          <span className="brand-name">nexora<span>®</span></span>
        </a>
        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="menu-toggle md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
        >
          {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <div className={`nav-content md:flex${isMenuOpen ? ' nav-content-open' : ''}`}>
          <div className="nav-links">
            {links.map((link) => (
              <a href={link.href} key={link.href} onClick={closeMenu}>{link.label}</a>
            ))}
          </div>
          <a className="nav-contact" href="#contact" onClick={closeMenu}>
            Let&apos;s talk <ArrowUpRight size={15} />
          </a>
        </div>
        <button className="nav-chat" type="button" onClick={onOpenChat}>
          <span className="nav-chat-dot" /> Ask AI
        </button>
      </nav>
    </header>
  )
}

export default Navbar
