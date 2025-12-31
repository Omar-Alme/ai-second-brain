"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/3d-testimonails";

const testimonials = [
  {
    name: "Amina",
    username: "@amina",
    body: "Finally a workspace that keeps me focused. Notes + canvas feels seamless.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    country: "🇦🇺 Australia",
  },
  {
    name: "Omar",
    username: "@omar",
    body: "I capture quickly, then connect everything later. It’s the calmest tool I’ve tried.",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    country: "🇺🇸 USA",
  },
  {
    name: "Sara",
    username: "@sara",
    body: "The UI stays out of the way. I spend more time thinking and less time organizing.",
    img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    country: "🇨🇦 Canada",
  },
  {
    name: "Maya",
    username: "@maya",
    body: "The bulk selection + delete flow is exactly what I wanted. Super clean.",
    img: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    country: "🇮🇳 India",
  },
  {
    name: "Lucas",
    username: "@lucas",
    body: "Dark mode is gorgeous and consistent across the whole app.",
    img: "https://images.unsplash.com/photo-1541647376583-8934aaf3448a?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    country: "🇫🇷 France",
  },
  {
    name: "Noah",
    username: "@noah",
    body: "Fast, minimal, and feels like a real product. Love it.",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    country: "🇩🇪 Germany",
  },
] as const;

function TestimonialCard(props: (typeof testimonials)[number]) {
  const { img, name, username, body, country } = props;
  return (
    <Card className="w-56">
      <CardContent className="p-4">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="flex items-center gap-1 text-sm font-medium text-foreground">
              {name} <span className="text-xs">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-muted-foreground">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-muted-foreground">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

export function Testimonials3D() {
  return (
    <div className="relative flex h-96 w-full max-w-[900px] flex-row items-center justify-center gap-1.5 overflow-hidden rounded-3xl border border-border bg-background/60 [perspective:300px] shadow-sm backdrop-blur">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
        }}
      >
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
          {testimonials.map((review) => (
            <TestimonialCard key={review.username} {...review} />
          ))}
        </Marquee>
      </div>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
    </div>
  );
}


