import React from 'react';
import './Settings.css';

export default function Settings(props) {
    return (
        <div className="settings-wrapper">
            <header className="app-header glass-header">
                <div className="header-glow"></div>
                <div className="header-content">
                    <h1>Settings</h1>
                    <p>Manage your attention preferences and account.</p>
                </div>
            </header>

            <main className="layout settings-layout">
                <aside className="sidebar">
                    <section className="card glass-card nav-card">
                        <h2 className="section-title">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                            Navigation
                        </h2>
                        <ul className="list nav-list">
                            <li><a className="link nav-link" href="./index.html">Dashboard</a></li>
                            <li><span className="muted nav-link active">Settings</span></li>
                        </ul>
                    </section>
                </aside>

                <section className="content settings-content">
                    <div className="card glass-card actionsBar-wrapper" id="actionsBar">
                        <button id="cancelBtn" className="cta cancel-cta">Cancel</button>
                        <button id="saveBtn" className="cta primary-cta glow-btn">Save Changes</button>
                    </div>

                    <section className="card glass-card">
                        <div className="card-glow"></div>
                        <h2 className="section-title text-gradient">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            General Information
                        </h2>
                        <div className="grid form-grid">
                            <div className="field input-field">
                                <label htmlFor="nameInput">Name</label>
                                <input id="nameInput" type="text" placeholder="Your name" className="glass-input" />
                                <div id="nameError" className="small error-message">Name is required</div>
                            </div>
                            <div className="field input-field">
                                <label htmlFor="emailInput">University email</label>
                                <input id="emailInput" type="email" placeholder="you@university.edu" className="glass-input" />
                                <div id="emailError" className="small error-message">Enter a valid university email</div>
                            </div>
                        </div>
                    </section>

                    <section className="card glass-card">
                        <div className="card-glow"></div>
                        <h2 className="section-title text-gradient">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                            </svg>
                            Attention Preferences
                        </h2>
                        <div className="grid">
                            <div className="field">
                                <label htmlFor="budgetSlider">Weekly Attention Budget</label>
                                <div className="slider-container">
                                    <input id="budgetSlider" type="range" min="50" max="200" step="1" className="glass-slider" />
                                    <div id="budgetValue" className="points small glow-points">100</div>
                                </div>
                            </div>

                            <div className="field priority-field col-span-full">
                                <label>Priority Order</label>
                                <div id="priorityTags" className="tags-container">
                                    <button type="button" className="tag glass-tag" data-key="Academics" draggable="true">
                                        <span>Academics</span>
                                    </button>
                                    <button type="button" className="tag glass-tag" data-key="Skill" draggable="true">
                                        <span>Skill</span>
                                    </button>
                                    <button type="button" className="tag glass-tag" data-key="Networking" draggable="true">
                                        <span>Networking</span>
                                    </button>
                                </div>
                                <div className="small muted help-text">Click to set ranking or drag to reorder</div>
                            </div>

                            <div className="field col-span-full toggle-field">
                                <div className="toggle-wrapper">
                                    <div className="toggle-info">
                                        <label>Auto-adjust priorities</label>
                                        <span className="small muted">Dynamically adapt based on upcoming deadlines</span>
                                    </div>
                                    <label className="switch" htmlFor="autoAdjust">
                                        <input id="autoAdjust" type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                    <span id="autoAdjustLabel" className="muted status-label">Off</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="card glass-card">
                        <div className="card-glow"></div>
                        <h2 className="section-title text-gradient">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            Notifications
                        </h2>
                        <div className="grid grid-3">
                            <div className="field toggle-field vertical-toggle">
                                <div className="toggle-wrapper">
                                    <label>Email reminders</label>
                                    <div className="switch-group">
                                        <label className="switch" htmlFor="toggleEmailReminders">
                                            <input id="toggleEmailReminders" type="checkbox" />
                                            <span className="slider round"></span>
                                        </label>
                                        <span id="labelEmailReminders" className="muted status-label">Off</span>
                                    </div>
                                </div>
                            </div>

                            <div className="field toggle-field vertical-toggle">
                                <div className="toggle-wrapper">
                                    <label>Event alerts</label>
                                    <div className="switch-group">
                                        <label className="switch" htmlFor="toggleEventAlerts">
                                            <input id="toggleEventAlerts" type="checkbox" />
                                            <span className="slider round"></span>
                                        </label>
                                        <span id="labelEventAlerts" className="muted status-label">Off</span>
                                    </div>
                                </div>
                            </div>

                            <div className="field toggle-field vertical-toggle">
                                <div className="toggle-wrapper">
                                    <label>Weekly summary</label>
                                    <div className="switch-group">
                                        <label className="switch" htmlFor="toggleWeeklySummary">
                                            <input id="toggleWeeklySummary" type="checkbox" />
                                            <span className="slider round"></span>
                                        </label>
                                        <span id="labelWeeklySummary" className="muted status-label">Off</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="card glass-card">
                        <div className="card-glow"></div>
                        <h2 className="section-title text-gradient">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Security
                        </h2>
                        <div className="grid grid-2 security-grid">
                            <div className="field">
                                <button id="changePasswordBtn" className="glass-btn pulse-hover">Change password</button>
                            </div>
                            <div className="field toggle-field">
                                <div className="toggle-wrapper compact">
                                    <label htmlFor="toggleTwoFactor" className="security-label">Two-factor auth</label>
                                    <label className="switch" htmlFor="toggleTwoFactor">
                                        <input id="toggleTwoFactor" type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                    <span id="labelTwoFactor" className="muted status-label">Off</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </main>

            <div id="toast" className="glass-toast"></div>

            <dialog id="passwordModal" className="glass-modal">
                <div className="modal-glow"></div>
                <div className="modal-content">
                    <h3 className="modal-title">Change Password</h3>
                    <form id="passwordForm" method="dialog" className="modal-form">
                        <div className="field input-field">
                            <label htmlFor="currentPass">Current password</label>
                            <input id="currentPass" type="password" className="glass-input" />
                        </div>
                        <div className="field input-field">
                            <label htmlFor="newPass">New password</label>
                            <input id="newPass" type="password" minLength="6" className="glass-input" />
                        </div>
                        <div className="field input-field">
                            <label htmlFor="confirmPass">Confirm password</label>
                            <input id="confirmPass" type="password" minLength="6" className="glass-input" />
                            <div id="passError" className="small error-message">Passwords do not match</div>
                        </div>
                        <div className="modal-actions">
                            <button id="closePassModal" type="button" className="cta cancel-cta">Cancel</button>
                            <button id="submitPassModal" type="submit" className="cta primary-cta glow-btn">Update</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
}
