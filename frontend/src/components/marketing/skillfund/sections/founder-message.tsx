"use client";

export function FounderMessage() {
    return (
        <section className="skillfund-section py-28" id="founder" aria-label="Founder message">
            <div className="app-container">
                <div className="glassPanel p-8 md:p-12">
                    <p className="eyebrow">Founder message</p>
                    <h2 className="skillfund-h2">BUILT FOR TRADERS WHO HAVE SKILL BUT NOT CAPITAL.</h2>
                    <p className="mt-6 text-lg leading-8" style={{ color: "rgba(255,255,255,0.88)" }}>

                        SkillFund started with a simple observation. Many talented traders possess real skill. Few have access to
                        meaningful capital.
                    </p>
                    <p className="mt-4 text-lg leading-8" style={{ color: "rgba(255,255,255,0.88)" }}>

                        We wanted to create a system where performance matters more than account size.
                    </p>
                </div>
            </div>
        </section>
    );
}

