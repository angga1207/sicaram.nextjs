const Footer = () => {
    return (
        <div className="mt-auto p-6 text-center dark:text-white-dark ltr:sm:text-left rtl:sm:text-right text-xs">
            © {new Date().getFullYear() == 2023 ? 2023 : '2023 - ' + new Date().getFullYear()}. SiCaram Kabupaten Ogan Ilir. | Hak Cipta Dinas Kominfo Kabupaten Ogan Ilir.
        </div>
    );
};

export default Footer;
