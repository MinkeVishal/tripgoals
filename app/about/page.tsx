"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faEye,
  faAward,
  faShieldAlt,
  faClock,
  faMoneyBillWave,
  faUsers,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";

export default function AboutPage() {
  return (
    <div className="unified-background min-h-screen bg-cover bg-center bg-fixed animate-background-move relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-700/30 animate-gradient-shift"></div>

      <div className="relative z-10">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-black/60 via-black/40 to-black/60 text-white py-32 text-center relative z-10">
          <div className="max-w-4xl mx-auto px-5">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              About TripGoals
            </h1>
            <p className="text-lg md:text-xl opacity-90 drop-shadow-md">
              Discover our passion for creating unforgettable travel experiences
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-black">
                  Our Story
                </h2>
                <p className="text-lg leading-relaxed text-black">
                  Founded with a passion for exploring India's incredible
                  diversity, TripGoals has been curating exceptional travel
                  experiences for over a decade. We believe that travel is not
                  just about visiting places, but about creating memories that
                  last a lifetime.
                </p>

                <p className="text-lg leading-relaxed text-black">
                  Our team of experienced travel experts works tirelessly to
                  design unique itineraries that showcase the best of what India
                  has to offer - from the snow-capped peaks of the Himalayas to
                  the pristine beaches of Goa, from the royal palaces of
                  Rajasthan to the backwaters of Kerala.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="bg-white/90 p-8 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold text-black mb-4 flex items-center space-x-2">
                      <FontAwesomeIcon
                        icon={faCompass}
                        className="text-blue-500"
                      />
                      <span>Our Mission</span>
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      To make incredible India accessible to every traveler by
                      providing authentic, sustainable, and memorable travel
                      experiences that showcase the country's rich culture,
                      heritage, and natural beauty.
                    </p>
                  </div>

                  <div className="bg-white/90 p-8 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold text-black mb-4 flex items-center space-x-2">
                      <FontAwesomeIcon icon={faEye} className="text-blue-500" />
                      <span>Our Vision</span>
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      To be India's most trusted travel companion, known for
                      exceptional service, innovative itineraries, and our
                      commitment to responsible tourism that benefits local
                      communities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                  alt="Travel Adventure"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-white/90">
          <div className="max-w-7xl mx-auto px-5">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
              Why Choose TripGoals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: faAward,
                  title: "Expert Guidance",
                  description:
                    "Our experienced travel consultants provide personalized recommendations based on your preferences and budget.",
                },
                {
                  icon: faShieldAlt,
                  title: "Safe & Secure",
                  description:
                    "Your safety is our priority. We ensure all our packages meet the highest safety standards and protocols.",
                },
                {
                  icon: faClock,
                  title: "24/7 Support",
                  description:
                    "Round-the-clock customer support to assist you before, during, and after your journey.",
                },
                {
                  icon: faMoneyBillWave,
                  title: "Best Value",
                  description:
                    "Competitive pricing with transparent costs and no hidden fees. Get the best value for your money.",
                },
                {
                  icon: faUsers,
                  title: "Local Connections",
                  description:
                    "Strong partnerships with local operators ensure authentic experiences and support for communities.",
                },
                {
                  icon: faLeaf,
                  title: "Responsible Tourism",
                  description:
                    "Committed to sustainable and responsible tourism practices that preserve India's natural and cultural heritage.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                    <FontAwesomeIcon icon={feature.icon} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10+", label: "Years of Experience" },
                { number: "50,000+", label: "Happy Travelers" },
                { number: "1,000+", label: "Destinations Covered" },
                { number: "99%", label: "Customer Satisfaction" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .unified-background {
          background-image: url("https://images.unsplash.com/photo-1580475805491-3b1b70c4ef86?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
        }
      `}</style>
    </div>
  );
}
