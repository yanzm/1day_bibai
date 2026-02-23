"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "radix-ui";

interface PhotoGalleryProps {
  photos: string[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* サムネイル横並び */}
      <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
        {photos.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleOpen(i)}
            className="shrink-0 rounded-lg overflow-hidden border border-border/60 hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <img
              src={url}
              alt=""
              className="h-16 w-24 object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* ライトボックスダイアログ */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-3xl w-[calc(100%-2rem)] p-2 sm:p-4 bg-black/95 border-none"
          showCloseButton={true}
        >
          <VisuallyHidden.Root>
            <DialogTitle>写真</DialogTitle>
          </VisuallyHidden.Root>
          <div className="relative flex items-center justify-center min-h-[300px]">
            <img
              src={photos[currentIndex]}
              alt=""
              className="max-h-[70vh] max-w-full object-contain rounded"
            />

            {/* 左右矢印（2枚以上の場合のみ） */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* ページインジケーター */}
          {photos.length > 1 && (
            <div className="text-center text-sm text-white/60">
              {currentIndex + 1} / {photos.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
