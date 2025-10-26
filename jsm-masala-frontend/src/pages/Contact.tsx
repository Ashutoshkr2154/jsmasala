// src/pages/Contact.tsx
import { Seo } from '@/components/common/Seo.tsx';
import { Button } from '@/components/common/Button.tsx';
import { Input } from '@/components/common/Input.tsx';
import { MapPin, Phone, Mail } from 'lucide-react';

// --- Contact Info Section Component ---
function ContactInfoSection() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold font-heading mb-4 text-brand-neutral">
                    Contact Information
                </h2>
                <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
                    Have a question or just want to say hello? We'd love to hear from you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Address Block */}
                    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                        <div className="bg-brand-primary/10 rounded-full p-3 mb-3">
                            <MapPin className="h-8 w-8 text-brand-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-brand-neutral">Our Address</h3>
                        <p className="text-gray-600">
                            Chota Nimdih Chaibasa, Jharkhand,<br /> West Singhbhum, India
                        </p>
                    </div>
                    {/* Phone Block */}
                    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                        <div className="bg-brand-primary/10 rounded-full p-3 mb-3">
                            <Phone className="h-8 w-8 text-brand-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-brand-neutral">Call Us</h3>
                        <a href="tel:9204710581" className="text-gray-600 hover:text-brand-primary transition-colors">
                            9204710581
                        </a>
                    </div>
                    {/* Email Block */}
                    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                        <div className="bg-brand-primary/10 rounded-full p-3 mb-3">
                            <Mail className="h-8 w-8 text-brand-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-brand-neutral">Email Us</h3>
                        <a href="mailto:jsmasala@gmail.com" className="text-gray-600 hover:text-brand-primary transition-colors">
                            jsmasala@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
// --- END OF Contact Info Section ---


// This is your main ContactPage component
export default function ContactPage() {
    // === USING THE URL YOU PROVIDED ===
    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.982641396426!2d85.80242640000003!3d22.54232300000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1e270020d3ee51%3A0xf3537e45bc4d9ca3!2sShani%20Mandir%2C%20Chota%20Nimdih!5e0!3m2!1sen!2sin!4v1761120174121!5m2!1sen!2sin";
    // ===================================

    return (
        <>
            <Seo
                title="Contact Us"
                description="Get in touch with JSM Masala. We're here to help with any questions, feedback, or inquiries."
            />
            <div className="container py-16">
                <h1 className="text-5xl font-extrabold font-heading text-center mb-12">
                    Get In Touch
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    {/* Contact Form */}
                    <div className="rounded-lg border bg-white p-8 shadow-lg">
                       <h2 className="text-3xl font-bold font-heading mb-6">Send Us a Message</h2>
                         <form className="space-y-6">
                            <Input label="Your Name" id="name" type="text" />
                            <Input label="Your Email" id="email" type="email" />
                            <Input label="Subject" id="subject" type="text" />
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className="w-full rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                />
                            </div>
                            <Button type="submit" size="lg" className="w-full">
                                Send Message
                            </Button>
                        </form>
                    </div>

                    {/* Map Section */}
                    <div className="rounded-lg border shadow-lg overflow-hidden min-h-[400px]">
                        <iframe
                            src={mapEmbedUrl} // Using the updated URL
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '400px' }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="JSM Masala Location Map"
                        ></iframe>
                    </div>
                </div>

                {/* Contact Info Section */}
                <ContactInfoSection />

            </div>
        </>
    );
}