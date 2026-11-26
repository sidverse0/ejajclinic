import Link from 'next/link';

export default function PageHeader({ title, intro, crumbs }) {
  return (
    <section className="page-head">
      <div className="container">
        {crumbs && (
          <nav className="crumbs" aria-label="Breadcrumb">
            {crumbs.map((c) => (
              <span key={c.href}>
                <Link href={c.href}>{c.label}</Link>
                <span aria-hidden="true"> / </span>
              </span>
            ))}
            <span aria-current="page">{title}</span>
          </nav>
        )}
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
    </section>
  );
}
