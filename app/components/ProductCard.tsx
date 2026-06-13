import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "../hooks/useLocalePath";

interface ProductCardProps {
  id: string | number;
  title: string;
  image_url?: string | null;
  prix?: string | number | null;
  categorie?: string;
  isNew?: boolean;
  totalStock?: number | null;
}

export default function ProductCard({ id, title, image_url, prix, categorie, isNew, totalStock }: ProductCardProps) {
  const { t } = useTranslation();
  const lp = useLocalePath();

  return (
    <Link
      to={lp(`/realisations/${id}`)}
      className="group flex flex-col rounded-lg overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-800 flex-shrink-0">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            loading="lazy"
            width={600}
            height={600}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-basecoat text-gray-400 dark:text-gray-500 text-sm">{t('home.no_image')}</span>
          </div>
        )}

        {/* Hover overlay avec bouton */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <span className="font-basecoat text-white font-bold uppercase tracking-widest text-xs border border-white px-5 py-2">
            {t('products.view')}
          </span>
        </div>

        {/* Badges */}
        {isNew && (
          <div className="absolute top-2 left-2 z-20 bg-benin-jaune text-black text-xs font-basecoat font-bold uppercase px-2.5 py-1 rounded-full shadow">
            {t('products.new_badge')}
          </div>
        )}
        {!isNew && totalStock !== null && totalStock !== undefined && (
          totalStock === 0 ? (
            <div className="absolute top-2 left-2 z-20 bg-benin-rouge text-white text-xs font-basecoat font-bold uppercase px-2.5 py-1 rounded-full shadow">
              {t('products.sold_out')}
            </div>
          ) : totalStock <= 2 ? (
            <div className="absolute top-2 left-2 z-20 bg-orange-500 text-white text-xs font-basecoat font-bold uppercase px-2.5 py-1 rounded-full shadow">
              Plus que {totalStock}
            </div>
          ) : null
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-basecoat font-bold uppercase text-sm sm:text-base text-gray-900 dark:text-gray-100 leading-tight mb-0.5">
          {title}
        </h3>
        {categorie && (
          <p className="font-basecoat text-xs text-gray-500 dark:text-gray-400 mb-2">{categorie}</p>
        )}
        <p className="font-basecoat text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mt-auto pt-2">
          {prix ? `${prix} €` : t('products.on_request')}
        </p>
      </div>
    </Link>
  );
}
