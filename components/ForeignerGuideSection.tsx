'use client';

export default function ForeignerGuideSection() {
  const openInstagramLink = () => {
    window.open(
      'https://www.instagram.com/reel/DC22Ob6ICGn/?igsh=eXo1cmszdjNmZmY=',
      '_blank' // Opens in a new tab
    );
  };

  return (
    <section className="py-6 relative z-10">
      <div className="max-w-full mx-auto px-5">
        <div 
          className="w-full mx-auto relative rounded-sm overflow-hidden cursor-pointer shadow-xl transition-all duration-400 bg-white/10 backdrop-blur-md border border-white/20 hover:scale-105 hover:shadow-2xl"
        >
          <div className="h-[300px] relative overflow-hidden">
            <img 
              src="https://www.arvholidays.in/images/europebanner.jpg" 
              alt="Banner"
              className="w-full h-full object-cover transition-transform duration-400 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/30 flex items-center justify-center text-center">
              <div className="text-white px-8">
                <h2 className="text-2xl font-bold mb-4 drop-shadow-lg">
                  Experience Fun
                </h2>
                <p className="text-lg mb-8 opacity-95 drop-shadow-md">
                  Check Our Stunning tour experiences
                </p>
                <button
                  onClick={openInstagramLink} // <-- Open Instagram link
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-none px-8 py-4 rounded-full cursor-pointer text-base font-semibold inline-flex items-center space-x-2 transition-all duration-300 hover:from-orange-400 hover:to-yellow-400 hover:-translate-y-0.5 shadow-lg hover:shadow-yellow-400/40"
                >
                  <span>See More</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
