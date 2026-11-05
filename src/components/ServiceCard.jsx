import { ArrowUpRight, Cloud, Code2, LineChart, WandSparkles } from 'lucide-react'

const icons = {
  transform: WandSparkles,
  cloud: Cloud,
  code: Code2,
  chart: LineChart,
}

function ServiceCard({ service }) {
  const Icon = icons[service.icon]

  return (
    <article className={`service-card service-card-${service.color}`}>
      <div className="service-card-top">
        <span className="service-icon"><Icon size={22} strokeWidth={1.8} /></span>
        <span className="service-number">{service.number}</span>
      </div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <a href="#contact" aria-label={`Learn about ${service.title}`}>
        <ArrowUpRight size={18} />
      </a>
    </article>
  )
}

export default ServiceCard
