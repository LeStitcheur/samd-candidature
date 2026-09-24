import { useRef } from 'react';

export default function Tabs({ id, label, items, value, onChange, className = '' }) {
  const refs = useRef([]);
  function onKeyDown(event, index) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    onChange(items[next].id);
    refs.current[next]?.focus();
  }
  return <div className={`tabs ${className}`} role="tablist" aria-label={label}>
    {items.map((item, index) => <button key={item.id} ref={element => { refs.current[index] = element; }} id={`${id}-tab-${item.id}`} role="tab" aria-selected={item.id === value} aria-controls={`${id}-panel-${item.id}`} tabIndex={item.id === value ? 0 : -1} onClick={() => onChange(item.id)} onKeyDown={event => onKeyDown(event, index)}>
      {item.icon && <item.icon size={16} aria-hidden="true" />}<span>{item.label}{item.description && <small>{item.description}</small>}</span>
    </button>)}
  </div>;
}
