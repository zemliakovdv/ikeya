// components/Catalog/FilterHiddenSections.jsx
export default function FilterHiddenSections() {
    const sections = [
        {
            title: 'Ширина (см)',
            options: ['0 - 49', '50 - 99', '100 - 149', '150 - 199', '200+']
        },
        {
            title: 'Глубина (см)',
            options: ['0 - 39', '40 - 49', '50 - 59', '60 - 69', '70+']
        },
        {
            title: 'Высота (см)',
            options: ['0 - 39', '40 - 59', '60 - 79', '80 - 99', '100+']
        },
        {
            title: 'Длина (см)',
            options: ['0 - 59', '60 - 79', '80 - 99', '100 - 119', '120+']
        }
    ];

    return (
        <>
            {sections.map((section, index) => (
                <div key={index} className="filter-section" style={{ display: 'none' }}>
                    <div className="section-title">
                        <span>{section.title}</span>
                        <span className="toggle-icon">
                            <img src="/assets/img/icons/arrow-down.svg" alt="" />
                        </span>
                    </div>
                    <div className="brand-grid">
                        {section.options.map((option, optIndex) => (
                            <label key={optIndex} className="brand-checkbox">
                                <input type="checkbox" />
                                <span className="custom-checkbox"></span>
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
}
