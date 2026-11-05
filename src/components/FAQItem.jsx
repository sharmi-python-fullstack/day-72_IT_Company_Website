import { useState } from 'react'
import { Plus } from 'lucide-react'

function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false)
  const answer = faq.answer ?? faq.response

  return (
    <article className={`faq-item${isOpen ? ' faq-item-open' : ''}`}>
      <h3>
        <button
          aria-expanded={isOpen}
          className="faq-question"
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        >
          <span>{faq.question}</span>
          <span className="faq-plus"><Plus size={18} /></span>
        </button>
      </h3>
      {isOpen && <p className="faq-answer">{answer}</p>}
    </article>
  )
}

export default FAQItem
