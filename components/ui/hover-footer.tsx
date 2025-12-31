"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Instagram,
  Twitter,
  Globe,
} from "lucide-react";

import { cn } from "@/lib/utils";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = React.useState({ x: 0, y: 0 });
  const [hovered, setHovered] = React.useState(false);
  const [maskPosition, setMaskPosition] = React.useState({ cx: "50%", cy: "50%" });

  React.useEffect(() => {
    if (!svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
    const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
    setMaskPosition({
      cx: `${cxPercentage}%`,
      cy: `${cyPercentage}%`,
    });
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer", className)}
      aria-label={text}
      role="img"
    >
      <defs>
        <linearGradient id="textGradient" gradientUnits="userSpaceOnUse" cx="50%" cy="50%" r="25%">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#80eeb4" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-border font-[helvetica] text-7xl font-bold"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>

      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-primary font-[helvetica] text-7xl font-bold"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, hsl(var(--background) / .45) 50%, hsl(var(--primary) / .20) 100%)",
      }}
    />
  );
};

export default function HoverFooter() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Sign up", href: "/sign-up" },
        { label: "Workspace", href: "/workspace" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Docs (soon)", href: "#" },
        { label: "Support", href: "#" },
        { label: "AI Chat (soon)", href: "/workspace/chat", pulse: true },
      ],
    },
  ] as const;

  const contactInfo = [
    {
      icon: <Mail size={18} className="text-primary" aria-hidden />,
      text: "hello@noma.app",
      href: "mailto:hello@noma.app",
    },
    {
      icon: <Phone size={18} className="text-primary" aria-hidden />,
      text: "+00 000 000 000",
      href: "tel:+00000000000",
    },
    {
      icon: <MapPin size={18} className="text-primary" aria-hidden />,
      text: "Remote",
    },
  ] as const;

  const socialLinks = [
    { icon: <Github size={20} />, label: "GitHub", href: "#" },
    { icon: <Twitter size={20} />, label: "Twitter", href: "#" },
    { icon: <Instagram size={20} />, label: "Instagram", href: "#" },
    { icon: <Globe size={20} />, label: "Website", href: "#" },
  ] as const;

  return (
    <footer className="relative mt-24 border-t border-border/60 bg-background/30 backdrop-blur">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 pb-12 md:grid-cols-2 lg:grid-cols-4 md:gap-8 lg:gap-16">
          {/* Brand */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-foreground text-3xl font-bold">
                Noma
              </Link>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A calm workspace for deep work — notes, canvas, and media that stay organized as your system grows.
            </p>
          </div>

          {/* Link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-foreground text-lg font-semibold mb-6">{section.title}</h4>
              <ul className="space-y-3 text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.label} className="relative">
                    {link.href.startsWith("/") ? (
                      <Link href={link.href} className="hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="hover:text-primary transition-colors">
                        {link.label}
                      </a>
                    )}
                    {"pulse" in link && link.pulse ? (
                      <span
                        className="absolute top-0 right-[-10px] h-2 w-2 rounded-full bg-primary animate-pulse"
                        aria-hidden
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-foreground text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-muted-foreground">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  {item.icon}
                  {("href" in item && item.href) ? (
                    <a href={item.href} className="hover:text-primary transition-colors">
                      {item.text}
                    </a>
                  ) : (
                    <span className="hover:text-primary transition-colors">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="my-8 border-t border-border/60" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row md:gap-0">
          <div className="flex space-x-6 text-muted-foreground">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-primary transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>

          <p className="text-center md:text-left text-muted-foreground">
            &copy; {new Date().getFullYear()} Noma. All rights reserved.
          </p>
        </div>
      </div>

      {/* Text hover effect */}
      <div className="hidden h-120 -mt-52 -mb-36 lg:flex">
        <TextHoverEffect text="Noma" className="z-10" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}


