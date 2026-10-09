import Link from 'next/link';
import { Badge } from '../Badge';
import { Card } from '../Card';
import { ImageWithFallback } from '../ImageWithFallback';

type CatalogCardProps = {
  href: string;
  name: string;
  imageUrl: string | null;
  isCustom: boolean;
  pixelated?: boolean;
};

export function CatalogCard({ href, name, imageUrl, isCustom, pixelated = false }: CatalogCardProps) {
  return (
    <Link href={href} className="group block h-full rounded-xl">
      <Card className="relative flex h-full flex-col items-center gap-2 transition-[border-color,box-shadow] group-hover:border-zinc-400 group-hover:shadow-md fit-screen:gap-1 fit-screen:p-2 dark:group-hover:border-zinc-600">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          fill
          sizes="160px"
          className={`h-24 w-full fit-screen:h-auto fit-screen:min-h-0 fit-screen:flex-1 ${pixelated ? '[&_img]:[image-rendering:pixelated]' : ''}`}
        />
        {isCustom && <Badge className="absolute top-2 right-2">Custom</Badge>}
        <span className="w-full shrink-0 truncate text-center font-medium" title={name}>
          {name}
        </span>
      </Card>
    </Link>
  );
}
