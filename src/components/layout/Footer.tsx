import Link from 'next/link';

const FOOTER_LINKS = {
  shop: [
    { label: 'Shoes', href: '/collections/shoes' },
    { label: 'Watches', href: '/collections/watches' },
    { label: 'Eyewear', href: '/collections/eyewear' },
    { label: 'Bags', href: '/collections/bags' },
    { label: 'Jewellery', href: '/collections/jewellery' },
    { label: 'Accessories', href: '/collections/accessories' },
  ],
  support: [
    { label: 'Contact Us', href: '/support/contact' },
    { label: 'Shipping & Returns', href: '/support/shipping' },
    { label: 'Care Guide', href: '/support/care' },
    { label: 'FAQ', href: '/support/faq' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Cookie Policy', href: '/legal/cookies' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[var(--color-bg)] pt-24 pb-12 border-t border-[var(--color-border)]">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-24">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="font-display text-2xl font-bold tracking-widest uppercase mb-6">Brood</h3>
            <p className="text-[var(--color-muted)] text-[13px] leading-relaxed max-w-[280px]">
              Curated luxury for the modern aesthetic. Exploring the intersection of craft, materiality, and utility.
            </p>
          </div>

          {/* Links */}
          <div className="col-span-1">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-[var(--color-ink)]">Shop</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.shop.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] hover:text-[var(--color-muted)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-[var(--color-ink)]">Support</h4>
            <ul className="space-y-4">
              {FOOTER_LINKS.support.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[13px] hover:text-[var(--color-muted)] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-[var(--color-ink)]">Newsletter</h4>
            <p className="text-[var(--color-muted)] text-[13px] leading-relaxed mb-6">
              Subscribe to receive updates on new arrivals, exclusive releases, and editorials.
            </p>
            <form className="flex border-b border-[var(--color-border)] hover:border-[var(--color-ink)] transition-colors pb-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-transparent border-none outline-none flex-1 text-[13px] placeholder:text-[var(--color-muted)]"
              />
              <button type="submit" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-opacity ml-4">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-8 border-t border-[var(--color-border)] gap-6">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-[11px] text-[var(--color-muted)] font-medium tracking-wide">
            <span>© {new Date().getFullYear()} BROOD. All rights reserved.</span>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {FOOTER_LINKS.legal.map(link => (
                <Link key={link.href} href={link.href} className="hover:text-[var(--color-ink)] transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4 items-center shrink-0">
            {/* Mock region selector */}
            <button className="text-[11px] font-medium tracking-wide border border-[var(--color-border)] rounded-none px-4 py-2 hover:border-[var(--color-ink)] transition-colors">
              India (INR ₹)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
