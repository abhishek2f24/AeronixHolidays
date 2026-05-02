"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Destination {
  name: string;
  region: string;
  tag: string;
  img: string;
}

interface Props {
  items: Destination[];
}

export function DestinationMarquee({ items }: Props) {
  // Duplicate items twice to ensure a seamless loop
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-10 bg-white">
      <motion.div
        className="flex gap-6 w-max"
        animate={{
          x: [0, -100 * items.length - 6 * items.length], // Adjust based on gap and item width
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ x: 0 }}
      >
        {duplicatedItems.map((d, i) => (
          <div
            key={`${d.name}-${i}`}
            className="relative w-[300px] h-[400px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer shrink-0"
          >
            <img 
              src={d.img} 
              alt={d.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <Badge className="mb-3 bg-white/20 text-white border-transparent text-[10px] backdrop-blur-md">
                {d.tag}
              </Badge>
              <p className="font-display text-2xl font-semibold text-white leading-tight">{d.name}</p>
              <p className="text-white/70 text-sm mt-1">{d.region}</p>
            </div>
          </div>
        ))}
      </motion.div>
      
      {/* Optional: Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
    </div>
  );
}
