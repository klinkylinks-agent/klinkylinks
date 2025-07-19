import { cn } from "@/lib/utils";

interface ViolationThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export function ViolationThumbnail({ src, alt, className, onClick }: ViolationThumbnailProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("violation-thumbnail", className)}
      onClick={onClick}
      loading="lazy"
    />
  );
}

export default ViolationThumbnail;
