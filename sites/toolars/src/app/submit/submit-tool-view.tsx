import { ArrowRight, Bookmark, CheckCircle2, Cloud, Eye, Image, Lock, Send, Sparkles } from "lucide-react";

const submissionSteps = [
  { title: "Tool basics", description: "Name, URL, description", state: "Active" },
  { title: "Classification", description: "Category, type, tags", state: "Next" },
  { title: "Pricing & processing", description: "Local, cloud, AI consent", state: "Next" },
  { title: "Review preview", description: "Checks and submit", state: "Next" }
] as const;

const checklist = [
  "Tool name",
  "Website URL",
  "Short description",
  "Long description",
  "Category",
  "Tags",
  "Tool type",
  "Processing",
  "Screenshot or logo"
] as const;

const timeline = [
  ["Submitted", "We received your submission."],
  ["Quality review", "Our team reviews your tool in 1-2 business days."],
  ["Security check", "We check for safety, policy, and data handling."],
  ["Published", "Your tool goes live for Toolars users."]
] as const;

export function SubmitToolView() {
  return (
    <div className="submit-tool-page" data-submit-tool-page="true">
      <section className="section landing-hero">
        <span className="eyebrow">Maker submission</span>
        <h1 className="title">Submit a tool to Toolars</h1>
        <p className="subtitle">Share your useful tool with thousands of users and get discovered.</p>
      </section>

      <div className="submit-layout">
        <form className="submit-form panel">
          <section className="submit-step-list" aria-label="Submission steps">
            {submissionSteps.map((step, index) => (
              <article className="submit-step-row" key={step.title}>
                <span className="mcp-stage-number">{index + 1}</span>
                <span>
                  <strong>{step.title}</strong>
                  <small>{step.description}</small>
                </span>
                <span className={index === 0 ? "badge local" : "badge"}>{step.state}</span>
              </article>
            ))}
          </section>

          <section className="submit-form-section">
            <h2>Tool basics</h2>
            <div className="submit-field-grid">
              <label className="field-label" htmlFor="tool-name">
                Tool name
                <input id="tool-name" name="toolName" defaultValue="Image Enhancer AI" />
              </label>
              <label className="field-label" htmlFor="website-url">
                Website URL
                <input id="website-url" name="websiteUrl" defaultValue="https://imageenhancer.ai" />
              </label>
              <label className="field-label submit-field-wide" htmlFor="short-description">
                Short description
                <input id="short-description" name="shortDescription" defaultValue="Enhance image quality, remove noise, and upscale images using AI." />
              </label>
              <label className="field-label submit-field-wide" htmlFor="long-description">
                Long description
                <textarea
                  id="long-description"
                  name="longDescription"
                  defaultValue="Image Enhancer AI helps you improve image quality in seconds. Remove noise, fix blur, enhance colors, and upscale images up to 4x using advanced AI models. Perfect for product photos, portraits, and artwork."
                />
              </label>
              <label className="field-label submit-field-wide" htmlFor="contact-email">
                Contact email
                <input id="contact-email" name="contactEmail" defaultValue="hello@imageenhancer.ai" />
              </label>
            </div>
          </section>

          <section className="submit-form-section">
            <h2>Classification</h2>
            <div className="submit-field-grid">
              <label className="field-label" htmlFor="category">
                Category
                <select id="category" name="category" defaultValue="Image">
                  <option>Image</option>
                  <option>PDF</option>
                  <option>Developer</option>
                </select>
              </label>
              <label className="field-label" htmlFor="tags">
                Tags
                <input id="tags" name="tags" defaultValue="AI, Image Enhancement, Upscale" />
              </label>
            </div>
            <p className="field-label">Tool type</p>
            <div className="submit-segment-row" role="group" aria-label="Tool type">
              <button className="button button-outline-neutral" type="button">
                Traditional
              </button>
              <button aria-pressed="true" className="button button-soft" type="button">
                AI-powered
              </button>
              <button className="button button-outline-neutral" type="button">
                Workflow
              </button>
            </div>
          </section>

          <section className="submit-form-section">
            <h2>Pricing & processing</h2>
            <div className="submit-field-grid">
              <fieldset className="submit-fieldset">
                <legend>Processing</legend>
                <label>
                  <input type="checkbox" name="processing" value="local" /> Local / On device
                </label>
                <label>
                  <input defaultChecked type="checkbox" name="processing" value="cloud" /> Cloud
                </label>
                <label>
                  <input defaultChecked type="checkbox" name="processing" value="ai-consent" /> AI consent required
                </label>
              </fieldset>
              <fieldset className="submit-fieldset">
                <legend>Pricing model</legend>
                <div className="submit-segment-row">
                  <button className="button button-outline-neutral" type="button">
                    Free
                  </button>
                  <button aria-pressed="true" className="button button-soft" type="button">
                    Freemium
                  </button>
                  <button className="button button-outline-neutral" type="button">
                    Paid
                  </button>
                </div>
              </fieldset>
            </div>
          </section>

          <section className="submit-form-section">
            <h2>Review preview</h2>
            <p className="tool-description">Preview how your tool will appear on Toolars before the submission enters <code>pending_review</code>.</p>
          </section>

          <div className="submit-action-row">
            <button className="button button-outline-neutral" type="button">
              Save draft
            </button>
            <button className="button button-outline-neutral" type="button">
              <Eye size={16} aria-hidden="true" /> Preview listing
            </button>
            <button className="button button-solid" type="button">
              <Send size={16} aria-hidden="true" /> Submit for review
            </button>
          </div>
        </form>

        <aside className="submit-preview panel">
          <h2>Preview</h2>
          <article className="submit-preview-card">
            <span className="icon-tile green">
              <Sparkles size={24} aria-hidden="true" />
            </span>
            <span>
              <strong>Image Enhancer AI</strong>
              <small>Enhance image quality, remove noise, and upscale images using AI.</small>
            </span>
            <BookmarkPreview />
            <p>Improve image quality in seconds. Remove noise, fix blur, enhance colors, and upscale images up to 4x using advanced AI models.</p>
            <div className="tag-list">
              <span className="badge ai">AI-powered</span>
              <span className="badge">Freemium</span>
              <span className="badge">Image</span>
            </div>
            <div className="submit-preview-footer">
              <span>
                <Image size={16} aria-hidden="true" /> Image
              </span>
              <span>
                <Cloud size={16} aria-hidden="true" /> Cloud
              </span>
              <button className="button button-outline-neutral" type="button">
                Open <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </article>
          <p className="submit-preview-note">Preview updates automatically as you fill the form.</p>
        </aside>

        <aside className="submit-review-rail">
          <section className="panel">
            <div className="landing-section-head">
              <h2>Review checklist</h2>
              <span className="badge local">8/9 complete</span>
            </div>
            <div className="submit-check-list">
              {checklist.map((item, index) => (
                <div className="submit-check-row" key={item}>
                  <CheckCircle2 size={16} color={index < 8 ? "#059669" : "#9ca3af"} aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>Submission guidelines</h2>
            <div className="detail-row-list">
              <div className="detail-row">
                <span className="badge local">Functional</span>
                <span>Your tool must be functional and accessible.</span>
              </div>
              <div className="detail-row">
                <span className="badge warn">Safety</span>
                <span>No malware, phishing, or harmful content.</span>
              </div>
              <div className="detail-row">
                <span className="badge ai">Disclosure</span>
                <span>Follow privacy best practices and disclose data usage.</span>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>What happens next?</h2>
            <div className="submit-timeline">
              {timeline.map(([title, description], index) => (
                <article className="submit-timeline-row" key={title}>
                  <span className={index === 0 ? "badge local" : "badge"}>{index + 1}</span>
                  <span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </span>
                </article>
              ))}
            </div>
            <p className="submit-preview-note">System state: <code>pending_review</code></p>
          </section>

          <section className="panel landing-private-card">
            <span className="icon-tile green">
              <Lock size={18} aria-hidden="true" />
            </span>
            <h2>Get featured faster</h2>
            <p className="tool-description">Upgrade to Pro to get priority review, featured placement, and more exposure.</p>
            <button className="button button-solid" type="button">
              Upgrade to Pro <ArrowRight size={14} aria-hidden="true" />
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function BookmarkPreview() {
  return (
    <span className="submit-bookmark" aria-hidden="true">
      <Bookmark size={18} />
    </span>
  );
}
