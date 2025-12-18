import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import CatalogModal from './CatalogModal';
import SmsCodeModal from './SmsCodeModal';
import SuccessModal from './SuccessModal';

export default function Modals() {
    return (
        <>
            <CatalogModal />
            <LoginModal />
            <RegisterModal />
            <SmsCodeModal />
            <SuccessModal />
        </>
    );
}
