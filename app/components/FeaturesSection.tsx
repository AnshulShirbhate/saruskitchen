import { Shield, Award, Heart, Leaf, Users, Palette } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Hygiene First",
    description:
      "Maintaining the highest standards of cleanliness and food safety in every step of our baking process.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Using only the finest ingredients to ensure every bite is a delightful experience.",
  },
  {
    icon: Heart,
    title: "Exceptional Taste",
    description: "Crafted with love and passion to deliver flavors that create lasting memories.",
  },
  {
    icon: Leaf,
    title: "Health Conscious",
    description: "Offering healthier alternatives without compromising on taste and quality.",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Your satisfaction is our priority. We go above and beyond to exceed your expectations.",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Create your dream cake with our extensive customization options for any occasion.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Creamy Creations?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are committed to delivering exceptional cakes that combine tradition with innovation, ensuring every
            celebration is made special.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-pink-100 p-3 rounded-full mr-4">
                  <feature.icon className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
