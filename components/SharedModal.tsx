export default function SharedModal({
  index,
  images,
  changePhotoId,
  closeModal,
  navigation,
  currentPhoto,
  direction,
}: SharedModalProps) {
  const [loaded, setLoaded] = useState(false);
  let currentImage = images ? images[index] : currentPhoto;

  // Logic to find "Detail" shots:
  // 1. Get the base ID (e.g., 'painting-1' from 'painting-1-detail-01')
  const baseId = currentImage.public_id.split("-detail")[0];
  
  // 2. Find all images that share that base ID but aren't the one we're looking at
  const detailShots = images?.filter((img) => 
    img.public_id.startsWith(baseId) && img.id !== index
  );

  // ... Swipe handlers ...

  return (
    <MotionConfig ...>
      <div className="relative z-50 flex h-full w-full max-w-7xl flex-col wide:flex-row items-center justify-center overflow-hidden">
        
        {/* Left Side: Large Image (Navigation arrows removed as requested) */}
        <div className="relative flex-grow h-1/2 wide:h-full w-full wide:w-3/4 overflow-hidden flex items-center justify-center p-4">
           {/* ... AnimatePresence + Image ... */}
        </div>

        {/* Right Side: Details Panel */}
        <div className="h-1/2 wide:h-full w-full wide:w-1/4 bg-black/40 backdrop-blur-xl p-6 flex flex-col text-white border-t wide:border-t-0 wide:border-l border-white/10 overflow-y-auto">
          <div className="flex-grow">
            <h2 className="text-xl font-bold tracking-tight">Painting Details</h2>
            
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-white/50">Artist</h3>
                <p className="text-base font-medium mt-0.5">{currentImage.artist || "Unknown Artist"}</p>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-white/50">Medium & Year</h3>
                <p className="text-sm mt-0.5">{currentImage.year || "N/A"}</p>
              </div>

              {/* Detail Shots Section */}
              {detailShots && detailShots.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-[10px] uppercase tracking-widest text-white/50 mb-3">Detail Views</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {detailShots.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => changePhotoId(img.id)}
                        className="relative aspect-square overflow-hidden rounded-md border border-white/10 transition hover:border-white/50"
                      >
                        <Image
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_thumb,w_200,h_200,g_auto/${img.public_id}.${img.format}`}
                          alt="Detail view"
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* ... Close/Download Buttons ... */}
        </div>
      </div>
    </MotionConfig>
  );
}
