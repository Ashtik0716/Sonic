// "children" is whatever is placed between <Section> and </Section>
function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
      {/* Horizontal scroll row; pb-2 leaves room for the scrollbar */}
      <div className="flex gap-4 overflow-x-auto pb-2">{children}</div>
    </section>
  )
}

export default Section