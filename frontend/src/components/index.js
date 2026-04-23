// src/components/index.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, ActivityIndicator, ScrollView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, Shadow, StatusColors, RoleColors, Typography } from '../theme';

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ label, size = 'md' }) => {
  const c = StatusColors[label] || RoleColors[label] || { bg: Colors.gray100, border: Colors.gray200, text: Colors.gray600 };
  const isSmall = size === 'sm';
  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }, isSmall && styles.badgeSm]}>
      <Text style={[styles.badgeText, { color: c.text }, isSmall && styles.badgeTextSm]}>{label}</Text>
    </View>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style, onPress, noPad }) => {
  const inner = [styles.card, noPad && { padding: 0 }, style];
  if (onPress) {
    return (
      <TouchableOpacity style={inner} onPress={onPress} activeOpacity={0.82}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={inner}>{children}</View>;
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, accent, sub, onPress, color }) => (
  <TouchableOpacity
    style={[styles.statCard, accent && styles.statCardAccent]}
    onPress={onPress}
    activeOpacity={onPress ? 0.82 : 1}
  >
    <Text style={[styles.statValue, accent && { color: '#fff' }, color && { color }]}>{value}</Text>
    <Text style={[styles.statLabel, accent && { color: Colors.blue200 }]}>{label}</Text>
    {sub ? <Text style={[styles.statSub, accent && { color: Colors.blue100 }]}>{sub}</Text> : null}
  </TouchableOpacity>
);

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = ({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, multiline, numberOfLines, right, error, style, autoFocus, editable = true }) => (
  <View style={[styles.inputGroup, style]}>
    {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
    <View style={[styles.inputWrap, error && styles.inputWrapError, !editable && styles.inputWrapDisabled]}>
      <TextInput
        style={[styles.input, multiline && { height: (numberOfLines || 4) * 22, textAlignVertical: 'top', paddingTop: 10 }]}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray300}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoFocus={autoFocus}
        editable={editable}
        autoCapitalize="none"
      />
      {right ? <View style={styles.inputRight}>{right}</View> : null}
    </View>
    {error ? <Text style={styles.inputError}>{error}</Text> : null}
  </View>
);

// ─── SelectInput ──────────────────────────────────────────────────────────────
export const SelectInput = ({ label, value, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.inputGroup}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <TouchableOpacity style={[styles.inputWrap, styles.selectWrap]} onPress={() => setOpen(!open)} activeOpacity={0.8}>
        <Text style={[styles.input, { flex: 1, color: value ? Colors.gray900 : Colors.gray300 }]}>{value || 'Sélectionner…'}</Text>
        <Text style={{ fontSize: 12, color: Colors.gray400, marginRight: 4 }}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.dropdownItem, value === opt && styles.dropdownItemActive]}
              onPress={() => { onSelect(opt); setOpen(false); }}
            >
              <Text style={[styles.dropdownText, value === opt && styles.dropdownTextActive]}>{opt}</Text>
              {value === opt && <Text style={{ color: Colors.blue600, fontSize: 14 }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// ─── PrimaryButton ────────────────────────────────────────────────────────────
export const PrimaryButton = ({ title, onPress, loading, style, danger, disabled, icon }) => (
  <TouchableOpacity
    style={[styles.primaryBtn, danger && styles.primaryBtnDanger, (disabled || loading) && styles.primaryBtnDisabled, style]}
    onPress={onPress}
    activeOpacity={0.85}
    disabled={loading || disabled}
  >
    {loading ? <ActivityIndicator color="#fff" size="small" /> : (
      <Text style={styles.primaryBtnText}>{icon ? `${icon}  ` : ''}{title}</Text>
    )}
  </TouchableOpacity>
);

// ─── SecondaryButton ──────────────────────────────────────────────────────────
export const SecondaryButton = ({ title, onPress, style, icon, danger }) => (
  <TouchableOpacity
    style={[styles.secondaryBtn, danger && styles.secondaryBtnDanger, style]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.secondaryBtnText, danger && styles.secondaryBtnTextDanger]}>
      {icon ? `${icon}  ` : ''}{title}
    </Text>
  </TouchableOpacity>
);

// ─── IconButton ───────────────────────────────────────────────────────────────
export const IconButton = ({ icon, onPress, badge, style }) => (
  <TouchableOpacity style={[styles.iconBtn, style]} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.iconBtnEmoji}>{icon}</Text>
    {badge ? <View style={styles.iconBtnBadge}><Text style={styles.iconBtnBadgeText}>{badge > 9 ? '9+' : badge}</Text></View> : null}
  </TouchableOpacity>
);

// ─── SearchBar ────────────────────────────────────────────────────────────────
export const SearchBar = ({ placeholder, value, onChangeText, onPress, style }) => {
  if (onPress) {
    return (
      <TouchableOpacity style={[styles.searchBar, style]} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>{placeholder || 'Rechercher…'}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <View style={[styles.searchBar, style]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder || 'Rechercher…'}
        placeholderTextColor={Colors.gray300}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
      {value ? (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Text style={{ fontSize: 14, color: Colors.gray400, paddingHorizontal: 4 }}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

// ─── FilterChip ───────────────────────────────────────────────────────────────
export const FilterChip = ({ label, active, onPress }) => (
  <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress} activeOpacity={0.8}>
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

export const FilterChips = ({ options, selected, onSelect }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
    {options.map((opt) => (
      <FilterChip key={opt} label={opt} active={selected === opt} onPress={() => onSelect(opt)} />
    ))}
  </ScrollView>
);

// ─── SectionTitle ─────────────────────────────────────────────────────────────
export const SectionTitle = ({ title, action, onAction, style }) => (
  <View style={[styles.sectionTitleRow, style]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action ? <TouchableOpacity onPress={onAction}><Text style={styles.sectionAction}>{action}</Text></TouchableOpacity> : null}
  </View>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
export const Divider = ({ style }) => <View style={[styles.divider, style]} />;

// ─── InfoRow ──────────────────────────────────────────────────────────────────
export const InfoRow = ({ label, value, children, last }) => (
  <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
    <Text style={styles.infoKey}>{label}</Text>
    {children || <Text style={styles.infoVal} numberOfLines={2}>{value}</Text>}
  </View>
);

// ─── ScreenHeader ─────────────────────────────────────────────────────────────
export const ScreenHeader = ({ title, onBack, right }) => (
  <View style={styles.screenHeader}>
    <View style={styles.headerLeft}>
      {onBack ? (
        <TouchableOpacity style={styles.backBtn} onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
    </View>
    {right ? <View style={styles.headerRight}>{right}</View> : null}
  </View>
);

// ─── AppBar ───────────────────────────────────────────────────────────────────
export const AppBar = ({ title, subtitle, right, style }) => (
  <View style={[styles.appBar, style]}>
    <View style={{ flex: 1 }}>
      <Text style={styles.appBarTitle}>{title}</Text>
      {subtitle ? <Text style={styles.appBarSub}>{subtitle}</Text> : null}
    </View>
    {right ? <View style={styles.appBarRight}>{right}</View> : null}
  </View>
);

// ─── NotifCard ────────────────────────────────────────────────────────────────
const NOTIF_ACCENT = {
  system:   Colors.purple400,
  security: Colors.red400,
  success:  Colors.teal400,
  mail:     Colors.blue400,
};
export const NotifCard = ({ item, onPress }) => (
  <TouchableOpacity
    style={[styles.notifCard, { borderLeftColor: NOTIF_ACCENT[item.type] || Colors.blue400 }, !item.read && styles.notifCardUnread]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={styles.notifCardInner}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.notifTitle, !item.read && { color: Colors.gray900 }]}>{item.title}</Text>
        <Text style={styles.notifSub}>{item.subtitle}</Text>
        <Text style={styles.notifTime}>{item.time}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </View>
  </TouchableOpacity>
);

// ─── MailCard ─────────────────────────────────────────────────────────────────
export const MailCard = ({ item, onPress, type = 'incoming' }) => {
  const isIn = type === 'incoming';
  return (
    <TouchableOpacity style={styles.mailCard} onPress={onPress} activeOpacity={0.82}>
      <View style={styles.mailCardLeft}>
        <View style={[styles.mailTypeTag, isIn ? styles.mailTypeIn : styles.mailTypeOut]}>
          <Text style={[styles.mailTypeText, isIn ? { color: Colors.blue600 } : { color: Colors.teal600 }]}>
            {isIn ? 'ENT' : 'SOR'}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.mailCardTop}>
          <Text style={styles.mailRef}>{item.reference}</Text>
          <Text style={styles.mailDate}>{isIn ? item.dateReceived : item.dateSent}</Text>
        </View>
        <Text style={styles.mailSubject} numberOfLines={1}>{item.subject}</Text>
        <Text style={styles.mailSenderRecip} numberOfLines={1}>
          {isIn ? `De : ${item.sender}` : `À : ${item.recipient}`}
        </Text>
        <View style={styles.mailCardBottom}>
          <Badge label={item.status} size="sm" />
          {item.attachments?.length > 0 && (
            <View style={styles.attachBadge}>
              <Text style={styles.attachBadgeText}>📎 {item.attachments.length}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
export const Avatar = ({ initials, role, size = 40 }) => {
  const c = RoleColors[role] || { bg: Colors.gray100, text: Colors.gray600 };
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 4.5, backgroundColor: c.bg }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.33, color: c.text }]}>{initials}</Text>
    </View>
  );
};

// ─── Toggle ───────────────────────────────────────────────────────────────────
export const Toggle = ({ value, onToggle, label, sublabel }) => (
  <View style={styles.toggleRow}>
    {(label || sublabel) ? (
      <View style={{ flex: 1 }}>
        {label ? <Text style={styles.toggleLabel}>{label}</Text> : null}
        {sublabel ? <Text style={styles.toggleSub}>{sublabel}</Text> : null}
      </View>
    ) : null}
    <TouchableOpacity
      style={[styles.toggle, value ? styles.toggleOn : styles.toggleOff]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <View style={[styles.toggleThumb, value ? styles.thumbOn : styles.thumbOff]} />
    </TouchableOpacity>
  </View>
);

// ─── OCRBox ───────────────────────────────────────────────────────────────────
export const OCRBox = ({ text }) => (
  <View style={styles.ocrBox}>
    <View style={styles.ocrHeader}>
      <Text style={styles.ocrHeaderText}>Texte extrait par OCR</Text>
      <View style={styles.ocrBadge}><Text style={styles.ocrBadgeText}>97% précision</Text></View>
    </View>
    <Text style={styles.ocrText}>{text}</Text>
  </View>
);

// ─── AIClassificationCard ─────────────────────────────────────────────────────
export const AICard = ({ category, confidence, alternatives, onApply }) => (
  <View style={styles.aiCard}>
    <View style={styles.aiHeader}>
      <View style={styles.aiHeaderLeft}>
        <Text style={styles.aiLabel}>CLASSIFICATION IA</Text>
        <Text style={styles.aiCategory}>{category}</Text>
      </View>
      <View style={styles.aiScoreCircle}>
        <Text style={styles.aiScoreNum}>{confidence}%</Text>
      </View>
    </View>
    <View style={styles.confBarTrack}>
      <View style={[styles.confBarFill, { width: `${confidence}%` }]} />
    </View>
    {alternatives?.length > 0 && (
      <View style={styles.altRow}>
        {alternatives.slice(0, 2).map((a) => (
          <View key={a.label} style={styles.altChip}>
            <Text style={styles.altLabel} numberOfLines={1}>{a.label}</Text>
            <Text style={styles.altConf}>{a.confidence}%</Text>
          </View>
        ))}
      </View>
    )}
    {onApply && (
      <TouchableOpacity style={styles.aiApplyBtn} onPress={onApply}>
        <Text style={styles.aiApplyText}>Appliquer la classification →</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── AttachmentItem ───────────────────────────────────────────────────────────
export const AttachmentItem = ({ file, onPress }) => {
  const cfg = {
    pdf:  { bg: Colors.coral50, border: '#F5C4B3', text: Colors.coral600, icon: '📄' },
    xlsx: { bg: Colors.green50, border: '#C0DD97', text: Colors.green600, icon: '📊' },
    docx: { bg: Colors.blue50,  border: Colors.blue100, text: Colors.blue600, icon: '📝' },
    img:  { bg: Colors.purple50, border: Colors.purple100, text: Colors.purple600, icon: '🖼' },
  };
  const c = cfg[file.type] || cfg.docx;
  return (
    <TouchableOpacity style={[styles.attachment, { backgroundColor: c.bg, borderColor: c.border }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.attachmentIcon}>{c.icon}</Text>
      <Text style={[styles.attachmentName, { color: c.text }]} numberOfLines={2}>{file.name}</Text>
      {file.size ? <Text style={styles.attachmentSize}>{file.size}</Text> : null}
    </TouchableOpacity>
  );
};

// ─── Timeline ─────────────────────────────────────────────────────────────────
const TIMELINE_COLORS = {
  blue: Colors.blue400, teal: Colors.teal400, amber: Colors.amber400,
  red: Colors.red400, green: Colors.green400, gray: Colors.gray300,
};
export const Timeline = ({ events }) => (
  <View style={styles.timeline}>
    {events.map((ev, i) => (
      <View key={i} style={styles.timelineItem}>
        <View style={styles.timelineLeft}>
          <View style={[styles.timelineDot, { backgroundColor: TIMELINE_COLORS[ev.color] || Colors.blue400 }]} />
          {i < events.length - 1 && <View style={styles.timelineLine} />}
        </View>
        <View style={styles.timelineContent}>
          <Text style={styles.timelineLabel}>{ev.label}</Text>
          <Text style={styles.timelineDate}>{ev.date}</Text>
        </View>
      </View>
    ))}
  </View>
);

// ─── QuickActionButton ────────────────────────────────────────────────────────
export const QuickActionButton = ({ icon, label, onPress, color }) => (
  <TouchableOpacity style={styles.qaBtn} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.qaIconWrap, color && { backgroundColor: color + '18' }]}>
      <Text style={styles.qaIcon}>{icon}</Text>
    </View>
    <Text style={styles.qaLabel}>{label}</Text>
  </TouchableOpacity>
);

// ─── ReadOnlyBanner ───────────────────────────────────────────────────────────
export const ReadOnlyBanner = () => (
  <View style={styles.readOnlyBanner}>
    <Text style={styles.readOnlyIcon}>👁</Text>
    <Text style={styles.readOnlyText}>Mode lecture seule — consultation uniquement</Text>
  </View>
);

// ─── EmptyState ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, subtitle }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>{icon || '📭'}</Text>
    <Text style={styles.emptyTitle}>{title || 'Aucun résultat'}</Text>
    {subtitle ? <Text style={styles.emptySub}>{subtitle}</Text> : null}
  </View>
);

// ─── SettingsRow ──────────────────────────────────────────────────────────────
export const SettingsRow = ({ label, sub, right, last, onPress }) => {
  const content = (
    <View style={[styles.settingsRow, last && { borderBottomWidth: 0 }]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingsLabel}>{label}</Text>
        {sub ? <Text style={styles.settingsSub}>{sub}</Text> : null}
      </View>
      {right}
    </View>
  );
  if (onPress) return <TouchableOpacity onPress={onPress} activeOpacity={0.8}>{content}</TouchableOpacity>;
  return content;
};

// ─── SectionHeader ────────────────────────────────────────────────────────────
export const SectionHeader = ({ label }) => (
  <Text style={styles.sectionHeader}>{label}</Text>
);

// ─── UserRow ──────────────────────────────────────────────────────────────────
export const UserRow = ({ user, onPress, last }) => (
  <TouchableOpacity
    style={[styles.userRow, last && { borderBottomWidth: 0 }]}
    onPress={onPress}
    activeOpacity={0.82}
  >
    <Avatar initials={user.initials} role={user.role} size={42} />
    <View style={{ flex: 1 }}>
      <Text style={styles.userRowName}>{user.fullName}</Text>
      <Text style={styles.userRowEmail}>{user.email}</Text>
    </View>
    <View style={{ alignItems: 'flex-end', gap: 4 }}>
      <Badge label={user.role} size="sm" />
      <Badge label={user.status} size="sm" />
    </View>
    <Text style={styles.chevron}>›</Text>
  </TouchableOpacity>
);

// ─── ActionBar ────────────────────────────────────────────────────────────────
export const ActionBar = ({ actions }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionBar}>
    {actions.map((a) => (
      <TouchableOpacity key={a.label} style={[styles.actionBarBtn, a.danger && styles.actionBarBtnDanger]} onPress={a.onPress} activeOpacity={0.8}>
        <Text style={styles.actionBarIcon}>{a.icon}</Text>
        <Text style={[styles.actionBarLabel, a.danger && styles.actionBarLabelDanger]}>{a.label}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

// ─── PageContainer ────────────────────────────────────────────────────────────
export const PageContainer = ({ children, style }) => (
  <SafeAreaView style={[styles.pageContainer, style]} edges={['top']}>
    {children}
  </SafeAreaView>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Badge
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1, alignSelf: 'flex-start' },
  badgeSm: { paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeTextSm: { fontSize: 10 },

  // Card
  card: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 0.5, borderColor: Colors.border, ...Shadow.sm },

  // StatCard
  statCard: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 0.5, borderColor: Colors.border, minWidth: '47%', flex: 1, ...Shadow.xs },
  statCardAccent: { backgroundColor: Colors.blue800, borderColor: Colors.blue700 },
  statValue: { fontSize: 26, fontWeight: '800', color: Colors.blue800, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, fontWeight: '600', color: Colors.gray500, marginTop: 2, letterSpacing: 0.2 },
  statSub: { fontSize: 10, color: Colors.gray400, marginTop: 1 },

  // Input
  inputGroup: { marginBottom: Spacing.md },
  inputLabel: { fontSize: 11, fontWeight: '700', color: Colors.gray600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.gray50, borderWidth: 1, borderColor: Colors.gray150, borderRadius: Radius.md, overflow: 'hidden' },
  inputWrapError: { borderColor: Colors.red400 },
  inputWrapDisabled: { opacity: 0.6 },
  input: { flex: 1, paddingHorizontal: Spacing.md, paddingVertical: 12, fontSize: 14, color: Colors.gray900 },
  inputRight: { paddingRight: Spacing.md },
  inputError: { fontSize: 11, color: Colors.red600, marginTop: 4 },

  // SelectInput
  selectWrap: { paddingRight: Spacing.sm },
  dropdown: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.gray150, borderRadius: Radius.md, marginTop: 2, overflow: 'hidden', ...Shadow.md, zIndex: 99 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight },
  dropdownItemActive: { backgroundColor: Colors.blue50 },
  dropdownText: { fontSize: 14, color: Colors.gray800 },
  dropdownTextActive: { color: Colors.blue800, fontWeight: '600' },

  // Buttons
  primaryBtn: { backgroundColor: Colors.blue800, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  primaryBtnDanger: { backgroundColor: Colors.red600 },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
  secondaryBtn: { backgroundColor: Colors.blue50, borderRadius: Radius.md, paddingVertical: 12, paddingHorizontal: Spacing.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderColor: Colors.blue100, gap: 4 },
  secondaryBtnDanger: { backgroundColor: Colors.red50, borderColor: Colors.red100 },
  secondaryBtnText: { color: Colors.blue800, fontSize: 13, fontWeight: '700' },
  secondaryBtnTextDanger: { color: Colors.red600 },

  // Icon button
  iconBtn: { width: 38, height: 38, borderRadius: Radius.sm, backgroundColor: Colors.blue50, alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 0.5, borderColor: Colors.blue100 },
  iconBtnEmoji: { fontSize: 17 },
  iconBtnBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: Colors.red400, borderRadius: 6, minWidth: 14, height: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#fff' },
  iconBtnBadgeText: { fontSize: 8, fontWeight: '800', color: '#fff' },

  // SearchBar
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.gray50, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.gray150, paddingHorizontal: Spacing.md, paddingVertical: 10, gap: 8 },
  searchIcon: { fontSize: 14 },
  searchPlaceholder: { fontSize: 14, color: Colors.gray300, flex: 1 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.gray900 },

  // FilterChips
  chipsRow: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: 2 },
  chip: { paddingHorizontal: Spacing.md, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.gray150 },
  chipActive: { backgroundColor: Colors.blue800, borderColor: Colors.blue800 },
  chipText: { fontSize: 12, fontWeight: '600', color: Colors.gray600 },
  chipTextActive: { color: '#fff' },

  // Section title
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.8 },
  sectionAction: { fontSize: 12, fontWeight: '600', color: Colors.blue600 },

  // Divider
  divider: { height: 0.5, backgroundColor: Colors.borderLight },

  // InfoRow
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 11, borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight, gap: 12 },
  infoKey: { fontSize: 12, fontWeight: '600', color: Colors.gray500, flex: 0.45 },
  infoVal: { fontSize: 13, fontWeight: '500', color: Colors.gray900, flex: 0.55, textAlign: 'right' },

  // ScreenHeader
  screenHeader: { backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.blue900, flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  backBtn: { width: 32, height: 32, borderRadius: Radius.sm, backgroundColor: Colors.blue50, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: Colors.blue100 },
  backIcon: { fontSize: 22, color: Colors.blue800, lineHeight: 26, marginTop: -1 },

  // AppBar
  appBar: { backgroundColor: Colors.surface, paddingHorizontal: Spacing.lg, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  appBarTitle: { fontSize: 16, fontWeight: '800', color: Colors.blue900, letterSpacing: -0.2 },
  appBarSub: { fontSize: 11, color: Colors.gray400, marginTop: 1 },
  appBarRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },

  // NotifCard
  notifCard: { backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, borderLeftWidth: 3, borderWidth: 0.5, borderColor: Colors.border, marginBottom: Spacing.sm },
  notifCardUnread: { backgroundColor: Colors.blue50, borderColor: Colors.blue100 },
  notifCardInner: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  notifTitle: { fontSize: 13, fontWeight: '600', color: Colors.gray700, marginBottom: 2 },
  notifSub: { fontSize: 12, color: Colors.gray500, marginBottom: 4 },
  notifTime: { fontSize: 11, color: Colors.gray400 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.blue400, marginTop: 4, flexShrink: 0 },

  // MailCard
  mailCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 0.5, borderColor: Colors.border, marginBottom: Spacing.sm, flexDirection: 'row', overflow: 'hidden', ...Shadow.xs },
  mailCardLeft: { width: 4, backgroundColor: Colors.border },
  mailTypeTag: { width: 44, alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  mailTypeIn: { backgroundColor: Colors.blue50 },
  mailTypeOut: { backgroundColor: Colors.teal50 },
  mailTypeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  mailCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3, paddingRight: Spacing.md, paddingTop: Spacing.md },
  mailRef: { fontSize: 10, fontWeight: '800', color: Colors.blue600, fontFamily: 'monospace', letterSpacing: 0.3 },
  mailDate: { fontSize: 10, color: Colors.gray400 },
  mailSubject: { fontSize: 14, fontWeight: '600', color: Colors.gray900, marginBottom: 2, paddingRight: Spacing.md },
  mailSenderRecip: { fontSize: 12, color: Colors.gray500, marginBottom: 8, paddingRight: Spacing.md },
  mailCardBottom: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: Spacing.md, paddingBottom: Spacing.md },
  attachBadge: { backgroundColor: Colors.gray100, borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 2 },
  attachBadgeText: { fontSize: 10, color: Colors.gray600, fontWeight: '600' },

  // Avatar
  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '800' },

  // Toggle
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: Colors.gray900 },
  toggleSub: { fontSize: 11, color: Colors.gray400, marginTop: 2 },
  toggle: { width: 46, height: 26, borderRadius: 13, padding: 3, justifyContent: 'center' },
  toggleOn: { backgroundColor: Colors.blue800 },
  toggleOff: { backgroundColor: Colors.gray200 },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', ...Shadow.sm },
  thumbOn: { alignSelf: 'flex-end' },
  thumbOff: { alignSelf: 'flex-start' },

  // OCRBox
  ocrBox: { backgroundColor: Colors.blue50, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.blue100, overflow: 'hidden' },
  ocrHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: Colors.blue100, backgroundColor: Colors.blue100 + '60' },
  ocrHeaderText: { fontSize: 11, fontWeight: '700', color: Colors.blue700, textTransform: 'uppercase', letterSpacing: 0.4 },
  ocrBadge: { backgroundColor: Colors.blue200, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  ocrBadgeText: { fontSize: 10, fontWeight: '700', color: Colors.blue800 },
  ocrText: { fontSize: 12, color: Colors.blue800, fontFamily: 'monospace', lineHeight: 20, padding: Spacing.md },

  // AICard
  aiCard: { backgroundColor: Colors.blue900, borderRadius: Radius.lg, padding: Spacing.md, overflow: 'hidden' },
  aiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  aiHeaderLeft: { flex: 1 },
  aiLabel: { fontSize: 10, fontWeight: '800', color: Colors.blue300, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  aiCategory: { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: -0.2 },
  aiScoreCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.teal400, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.teal200 + '60' },
  aiScoreNum: { fontSize: 13, fontWeight: '800', color: '#fff' },
  confBarTrack: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 4, height: 5, overflow: 'hidden', marginBottom: 10 },
  confBarFill: { backgroundColor: Colors.teal400, height: 5, borderRadius: 4 },
  altRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: 8 },
  altChip: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.sm, padding: 8, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)' },
  altLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500', marginBottom: 2 },
  altConf: { fontSize: 10, color: Colors.teal200, fontWeight: '700' },
  aiApplyBtn: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: Radius.sm, padding: 10, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)' },
  aiApplyText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  // Attachment
  attachment: { borderRadius: Radius.md, padding: Spacing.sm, borderWidth: 1, alignItems: 'center', width: '48%', margin: '1%' },
  attachmentIcon: { fontSize: 26, marginBottom: 6 },
  attachmentName: { fontSize: 11, fontWeight: '600', textAlign: 'center', marginBottom: 2 },
  attachmentSize: { fontSize: 10, color: Colors.gray400 },

  // Timeline
  timeline: {},
  timelineItem: { flexDirection: 'row', gap: 12, marginBottom: 2 },
  timelineLeft: { alignItems: 'center', width: 16 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 3, flexShrink: 0 },
  timelineLine: { width: 1.5, flex: 1, backgroundColor: Colors.gray150, marginTop: 4 },
  timelineContent: { flex: 1, paddingBottom: 14 },
  timelineLabel: { fontSize: 13, fontWeight: '600', color: Colors.gray800 },
  timelineDate: { fontSize: 11, color: Colors.gray400, marginTop: 2 },

  // QuickActionButton
  qaBtn: { alignItems: 'center', flex: 1, paddingVertical: 10, paddingHorizontal: 4 },
  qaIconWrap: { width: 46, height: 46, borderRadius: Radius.md, backgroundColor: Colors.blue50, alignItems: 'center', justifyContent: 'center', marginBottom: 6, borderWidth: 0.5, borderColor: Colors.blue100 },
  qaIcon: { fontSize: 20 },
  qaLabel: { fontSize: 10, fontWeight: '700', color: Colors.gray700, textAlign: 'center', lineHeight: 13 },

  // ReadOnly
  readOnlyBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.amber50, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.amber100, marginBottom: Spacing.sm },
  readOnlyIcon: { fontSize: 16 },
  readOnlyText: { fontSize: 12, fontWeight: '600', color: Colors.amber600, flex: 1 },

  // EmptyState
  emptyState: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: Spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.gray600 },
  emptySub: { fontSize: 13, color: Colors.gray400, textAlign: 'center', marginTop: 6, lineHeight: 18 },

  // SettingsRow
  settingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight, gap: 12 },
  settingsLabel: { fontSize: 14, fontWeight: '500', color: Colors.gray900 },
  settingsSub: { fontSize: 11, color: Colors.gray400, marginTop: 2 },

  // SectionHeader (inside card, above rows)
  sectionHeader: { fontSize: 11, fontWeight: '800', color: Colors.gray500, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 4 },

  // UserRow
  userRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight },
  userRowName: { fontSize: 14, fontWeight: '600', color: Colors.gray900 },
  userRowEmail: { fontSize: 12, color: Colors.gray400, marginTop: 1 },
  chevron: { fontSize: 20, color: Colors.gray300, marginLeft: 4 },

  // ActionBar
  actionBar: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  actionBarBtn: { alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.md, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 0.5, borderColor: Colors.border, gap: 4 },
  actionBarBtnDanger: { backgroundColor: Colors.red50, borderColor: Colors.red100 },
  actionBarIcon: { fontSize: 18 },
  actionBarLabel: { fontSize: 11, fontWeight: '700', color: Colors.gray700 },
  actionBarLabelDanger: { color: Colors.red600 },

  // PageContainer
  pageContainer: { flex: 1, backgroundColor: Colors.background },
});
