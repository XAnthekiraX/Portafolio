import PropTypes from 'prop-types';
import InputField from '../Common/InputField';
import TextArea from '../Common/TextArea';
import SubmitButton from '../Common/SubmitButton';

export default function ContactSection({ language }) {
    return (
        <section id="Contact" className="flex items-center justify-center w-screen h-auto px-10 py-4 text-gray-100 lg:h-screen animation">
            <div className="container max-w-2xl mx-auto">
                <h2 className="mb-12 text-4xl font-bold text-center text-purple-500">
                    {language === 'esp' ? 'Contáctame' : 'Contact Me'}
                </h2>
                <form className="space-y-6">
                    <InputField
                        id="name"
                        labelEsp="Nombre"
                        labelEng="Name"
                        placeholderEsp="Tu nombre"
                        placeholderEng="Your name"
                        language={language}
                    />
                    <InputField
                        id="email"
                        labelEsp="Correo"
                        labelEng="Email"
                        placeholderEsp="tu@correo.com"
                        placeholderEng="your@email.com"
                        language={language}
                    />
                    <TextArea
                        id="message"
                        labelEsp="Mensaje"
                        labelEng="Message"
                        placeholderEsp="Tu mensaje"
                        placeholderEng="Your message"
                        language={language}
                    />
                    <SubmitButton language={language} />
                </form>
            </div>
        </section>
    );
}

ContactSection.propTypes = {
    language: PropTypes.string.isRequired,
};
