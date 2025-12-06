
import React, { useState } from 'react';
import { Star, X, Camera, Send, Flag, ThumbsUp, Trash2 } from 'lucide-react';
import { useApp } from '../context';
import { MOCK_RESTAURANTS } from '../constants';
import { Review } from '../types';

// --- REVIEW FORM (Post-Scanner) ---

interface ReviewFormProps {
  restaurantId: string;
  dishId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ restaurantId, dishId, onClose, onSuccess }) => {
  const { addReview, user } = useApp();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  // Simula o "Tirar Foto" com uma imagem aleatória de comida
  const handleTakePhoto = () => {
    // Em um app real, abriria a câmera nativa/input file
    const mockImages = [
       "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
       "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80",
       "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=500&q=80"
    ];
    setPhoto(mockImages[Math.floor(Math.random() * mockImages.length)]);
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    
    // Tenta encontrar o nome do prato se o dishId estiver presente
    let dishName = undefined;
    if (dishId) {
        // Busca na lista mockada global (fallback)
        const rest = MOCK_RESTAURANTS.find(r => r.id === restaurantId);
        dishName = rest?.menu.find(d => d.id === dishId)?.name;
    }

    addReview({
      restaurantId,
      dishName,
      rating,
      text: comment,
      image: photo || undefined
    });
    
    onSuccess();
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-bottom-5">
      <div className="flex-1 flex flex-col items-center pt-6">
         <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Como estava?</h3>
         <p className="text-gray-500 mb-8">Avalie sua experiência</p>

         {/* Stars */}
         <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
               <button 
                 key={star}
                 onClick={() => setRating(star)}
                 className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
               >
                  <Star 
                    className={`w-10 h-10 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                  />
               </button>
            ))}
         </div>

         {/* Comment */}
         <textarea
           placeholder="Escreva um comentário curto (opcional)..."
           value={comment}
           onChange={(e) => setComment(e.target.value)}
           className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 resize-none h-24 mb-4 focus:ring-2 focus:ring-brand-500 focus:outline-none"
         />

         {/* Photo Button */}
         {photo ? (
            <div className="relative w-full h-32 rounded-xl overflow-hidden mb-6 group">
               <img src={photo} className="w-full h-full object-cover" alt="Review" />
               <button 
                 onClick={() => setPhoto(null)}
                 className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
         ) : (
            <button 
              onClick={handleTakePhoto}
              className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-6"
            >
              <Camera className="w-5 h-5" />
              Adicionar foto do prato
            </button>
         )}
      </div>

      <div className="flex gap-3 mt-auto">
         <button 
           onClick={onClose}
           className="flex-1 py-4 bg-gray-200 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 font-bold"
         >
           Pular
         </button>
         <button 
           onClick={handleSubmit}
           disabled={rating === 0}
           className="flex-[2] py-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-bold flex items-center justify-center gap-2"
         >
           Enviar Avaliação <Send className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};

// --- REVIEW GALLERY (Inside Restaurant Details) ---

interface ReviewGalleryProps {
  restaurantId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewGallery: React.FC<ReviewGalleryProps> = ({ restaurantId, isOpen, onClose }) => {
  const { reviews, reportReview, user } = useApp();

  // Filtrar reviews deste restaurante que tenham IMAGEM e não estejam ocultos
  const restaurantReviews = reviews.filter(
     r => r.restaurantId === restaurantId && r.image && !r.isHidden
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
       <div className="bg-white dark:bg-gray-900 w-full max-w-lg h-[80vh] rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col animate-in zoom-in-95">
          
          <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">Galeria da Comunidade</h3>
             <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <X className="w-5 h-5" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
             {restaurantReviews.length === 0 ? (
                <div className="text-center py-20">
                   <Camera className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                   <p className="text-gray-500">Nenhuma foto compartilhada ainda.</p>
                </div>
             ) : (
                restaurantReviews.map(review => (
                   <div key={review.id} className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
                      <img src={review.image} alt="Dish" className="w-full h-64 object-cover" />
                      <div className="p-4">
                         <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                               <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                  {review.userAvatar && <img src={review.userAvatar} className="w-full h-full" />}
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{review.userName}</p>
                                  <div className="flex items-center gap-1">
                                     <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                     <span className="text-xs font-bold text-gray-500">{review.rating}</span>
                                  </div>
                               </div>
                            </div>
                            
                            {/* Admin Action */}
                            <button 
                              onClick={() => {
                                 if(confirm("Reportar e remover este conteúdo?")) reportReview(review.id);
                              }}
                              className="text-gray-400 hover:text-red-500"
                              title="Reportar (Admin)"
                            >
                               <Flag className="w-4 h-4" />
                            </button>
                         </div>
                         
                         {review.dishName && (
                            <div className="inline-block bg-white dark:bg-gray-700 px-2 py-0.5 rounded-md text-[10px] font-bold text-gray-500 mb-2">
                               {review.dishName}
                            </div>
                         )}

                         <p className="text-sm text-gray-600 dark:text-gray-300">{review.text}</p>
                      </div>
                   </div>
                ))
             )}
          </div>

       </div>
    </div>
  );
};
