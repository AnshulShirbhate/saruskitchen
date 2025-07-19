import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Clock, Heart } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Happy Customers", value: "1000+" },
    { icon: Clock, label: "Years of Experience", value: "5+" },
    { icon: Heart, label: "Cakes Made", value: "1500+" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Creamy Creations</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Crafting sweet memories since 2020, we are passionate about creating the perfect cake for every
              celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/images/bakery-illustration.png"
                alt="Our Bakery"
                width={500}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  What started as a small home bakery has grown into one of the most trusted names in custom cakes and
                  desserts. Our journey began with a simple belief: every celebration deserves a perfect cake.
                </p>
                <p>
                  We combine traditional baking techniques with modern flavors and designs to create cakes that not only
                  taste amazing but also look stunning. Our commitment to quality ingredients and hygiene standards has
                  earned us the trust of thousands of customers.
                </p>
                <p>
                  Today, we continue to innovate while staying true to our core values of quality, hygiene, and customer
                  satisfaction. Every cake that leaves our kitchen is a testament to our passion for baking excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-pink-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To create exceptional cakes and desserts that bring joy to every celebration while maintaining the
                  highest standards of quality, hygiene, and customer service. We believe that every cake should be a
                  masterpiece that creates lasting memories.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To be the most trusted and beloved bakery brand, known for our innovative designs, exceptional taste,
                  and commitment to making every customer's dream cake a reality. We envision a world where every
                  celebration is made sweeter with our creations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  )
}
