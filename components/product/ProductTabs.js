'use client';

import { useState } from 'react';

export default function ProductTabs({ tabs }) {
  const enabledTabs = tabs.filter(tab => tab.enabled !== false);
  const [activeTab, setActiveTab] = useState(enabledTabs[0]?.id || '');

  if (enabledTabs.length === 0) return null;

  return (
    <section className="character">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="character-inner">
              <div className="character-tabs">
                <nav className="character-tabs__nav">
                  <div className="nav nav-tabs character-nav__tabs" id="nav-tab" role="tablist">
                    {enabledTabs.map((tab) => (
                      <button
                        key={tab.id}
                        className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                        id={`nav-${tab.id}-tab`}
                        onClick={() => setActiveTab(tab.id)}
                        type="button"
                        role="tab"
                        aria-controls={`nav-${tab.id}`}
                        aria-selected={activeTab === tab.id}
                      >
                        {tab.label}
                        {tab.count && <span className="if_have_feed_count">{tab.count}</span>}
                      </button>
                    ))}
                  </div>
                </nav>

                <div className="tab-content character-tab__content" id="nav-tabContent">
                  {enabledTabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`tab-pane fade ${activeTab === tab.id ? 'show active' : ''}`}
                      id={`nav-${tab.id}`}
                      role="tabpanel"
                      aria-labelledby={`nav-${tab.id}-tab`}
                      tabIndex="0"
                    >
                      {tab.content}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
