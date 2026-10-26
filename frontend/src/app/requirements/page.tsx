'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { fetchRequirements } from '@/lib/api';
import { formatDate, formatINR, categoryLabel } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';
import styles from './page.module.css';
import { AlertCircle, CalendarDays, ClipboardList, Eye, MapPin, RefreshCw, X } from 'lucide-react';
import { getRequirementDisplayFields } from '@/lib/requirementDisplay';
import type { RequirementPayload } from '@/types/requirement.types';

type BrowseRequirement = RequirementPayload & {
  _id: string;
  createdAt: string;
  [key: string]: unknown;
};

export default function RequirementsListPage() {
  const [requirements, setRequirements] = useState<BrowseRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedRequirement, setSelectedRequirement] = useState<BrowseRequirement | null>(null);

  useEffect(() => {
    if (!selectedRequirement) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedRequirement(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRequirement]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRequirements();
      setRequirements(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadData(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const filteredRequirements = requirements.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });
  const selectedCategory = typeof selectedRequirement?.category === 'string'
    ? selectedRequirement.category
    : '';
  const selectedEventName = typeof selectedRequirement?.eventName === 'string'
    ? selectedRequirement.eventName
    : 'Event requirement';

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>All Event Requirements</h1>
              <p className={styles.subtitle}>
                Browse all client event requirements submitted to the GoPratle platform.
              </p>
            </div>
          </div>

          <div className={styles.filterBar}>
            <div className={styles.filterTabs}>
              {['all', 'planner', 'performer', 'crew'].map((cat) => (
                <button
                  key={cat}
                  className={`${styles.tab} ${filterCategory === cat ? styles.activeTab : ''}`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat === 'all' ? 'All Roles' : categoryLabel(cat)}
                  <span className={styles.tabCount}>
                    {cat === 'all'
                      ? requirements.length
                      : requirements.filter((r) => r.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
            <button onClick={loadData} className={styles.refreshBtn} title="Refresh entries">
              <RefreshCw size={14} aria-hidden="true" /> Refresh
            </button>
          </div>

          {loading && (
            <div className={styles.loadingBox}>
              <Spinner size="lg" />
              <p>Loading requirements from database...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorBox}>
              <p className={styles.errorText}><AlertCircle size={16} aria-hidden="true" /> {error}</p>
              <button onClick={loadData} className={styles.retryBtn}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredRequirements.length === 0 && (
            <div className={styles.emptyBox}>
              <div className={styles.emptyIcon}><ClipboardList size={27} strokeWidth={1.7} aria-hidden="true" /></div>
              <h3>No requirements posted yet</h3>
              <p>Be the first to submit an event requirement!</p>
              <Link href="/requirements/new" className={styles.createBtn}>
                Post Requirement Now
              </Link>
            </div>
          )}

          {!loading && !error && filteredRequirements.length > 0 && (
            <div className={styles.grid}>
              {filteredRequirements.map((item) => (
                <div key={item._id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={`${styles.badge} ${styles[item.category]}`}>
                      {categoryLabel(item.category)}
                    </span>
                    <span className={styles.budget}>
                      {formatINR(item.details?.estimatedBudget || 0)}
                    </span>
                  </div>

                  <h3 className={styles.eventName}>{item.eventName}</h3>
                  <div className={styles.eventTypeTag}>{item.eventType}</div>

                  <div className={styles.metaList}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaIcon}><MapPin size={15} aria-hidden="true" /></span>
                      <span>
                        {item.location} {item.venue ? `(${item.venue})` : ''}
                      </span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaIcon}><CalendarDays size={15} aria-hidden="true" /></span>
                      <span>
                        {formatDate(item.startDate?.split('T')[0])} —{' '}
                        {formatDate(item.endDate?.split('T')[0])}
                      </span>
                    </div>
                  </div>

                  <div className={styles.detailsDivider} />

                  <div className={styles.detailsSummary}>
                    {item.category === 'planner' && (
                      <>
                        <div className={styles.spec}>
                          <strong>Scale:</strong> {item.details?.expectedAttendance} guests (
                          {item.details?.planningScope === 'full-service'
                            ? 'Full-Service'
                            : 'Partial'}
                          )
                        </div>
                        {item.details?.servicesRequired?.length > 0 && (
                          <div className={styles.specTags}>
                            {item.details.servicesRequired.map((srv: string) => (
                              <span key={srv} className={styles.specTag}>
                                {srv}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {item.category === 'performer' && (
                      <>
                        <div className={styles.spec}>
                          <strong>Role:</strong>{' '}
                          {item.details?.performanceType === 'other'
                            ? item.details?.performanceTypeOther
                            : item.details?.performanceType}
                          {' • '}{item.details?.numberOfPerformers} artist(s) for{' '}
                          {item.details?.performanceDuration} hr(s)
                        </div>
                        {item.details?.equipmentRequired?.length > 0 && (
                          <div className={styles.specTags}>
                            {item.details.equipmentRequired.map((eq: string) => (
                              <span key={eq} className={styles.specTag}>
                                {eq}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {item.category === 'crew' && (
                      <>
                        <div className={styles.spec}>
                          <strong>Staff:</strong>{' '}
                          {item.details?.requiredRole === 'other'
                            ? item.details?.requiredRoleOther
                            : item.details?.requiredRole}
                          {' • '}{item.details?.numberOfPersonnel} person(s),{' '}
                          {item.details?.workingHours} hrs/day
                        </div>
                        <div className={styles.spec}>
                          <strong>Gear provided:</strong>{' '}
                          {item.details?.equipmentProvided ? 'Yes' : 'No (Bring own gear)'}
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    className={styles.viewDetailsBtn}
                    onClick={() => setSelectedRequirement(item)}
                    aria-label={`View all details for ${item.eventName || 'event requirement'}`}
                  >
                    <Eye size={15} aria-hidden="true" /> View Details
                  </button>

                  <div className={styles.cardFooter}>
                    <span className={styles.refId}>ID: {item._id}</span>
                    <span className={styles.createdDate}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedRequirement && (
        <div
          className={styles.detailsOverlay}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedRequirement(null);
          }}
        >
          <section
            className={styles.detailsDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="requirement-dialog-title"
          >
            <header className={styles.detailsDialogHeader}>
              <div>
                <span className={`${styles.badge} ${styles[selectedCategory] || ''}`}>
                  {categoryLabel(selectedCategory)}
                </span>
                <h2 id="requirement-dialog-title" className={styles.detailsDialogTitle}>
                  {selectedEventName}
                </h2>
              </div>
              <button
                type="button"
                className={styles.closeDetailsBtn}
                onClick={() => setSelectedRequirement(null)}
                aria-label="Close requirement details"
                autoFocus
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            <dl className={styles.detailsFields}>
              {getRequirementDisplayFields(selectedRequirement).map(({ label, value }) => (
                <div className={styles.detailsField} key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      )}
    </div>
  );
}
