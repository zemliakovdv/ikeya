// components/Catalog/Breadcrumbs.jsx
export default function Breadcrumbs({ items = [], hidden = false }) {
    if (hidden || items.length === 0) {
        return (
            <section className="breadcumps" style={{ display: 'none' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="breadcumps-inner">
                                <a href="#">#</a>
                                <span>/</span>
                                <a href="#">#</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="breadcumps">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="breadcumps-inner">
                            {items.map((item, index) => (
                                <span key={index}>
                                    {index > 0 && <span>/</span>}
                                    <a href={item.href}>{item.label}</a>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
