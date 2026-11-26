-- ============================================================================
-- EXAMPLE VERTICAL SEED — MED-SPA DIRECTORY (Miami, FL)
-- Shows how to spin up a NEW vertical using this template.
--
-- Apply the CORE SCHEMA first (0001_core_schema.sql but with `medspa_` as the
-- table prefix, i.e. every `isabela_` replaced by `medspa_`), then run this
-- seed. Reference: src/lib/site.config.ts set tablePrefix: 'medspa_'.
--
-- To use: copy this file, find/replace `medspa_` with your own vertical prefix
-- (e.g. `dental_`, `restaurants_`), keep every table column identical to 0001,
-- and set your own business/offer/event rows. This struct copy is the verbose
-- version — for real use, one, well-written business row is enough to start.
-- ============================================================================

-- ---------- categories (med-spa vertical) ----------
insert into public.medspa_categories (id, name, description, icon, sort_order) values
  ('med-spa-aesthetic',   'Med-Spa & Aesthetic', 'Botox, fillers, laser and injectables.', 'sparkles', 10),
  ('skin-care',           'Skin Care',           'Facials, peels and custom skin programs.', 'droplet', 20),
  ('laser-hair-removal',  'Laser & IPL',         'Permanent hair reduction and body treatments.', 'zap', 30),
  ('body-contouring',     'Body Contouring',     'Non-invasive sculpting and fat reduction.', 'activity', 40),
  ('medical-aesthetics',  'Medical Aesthetics',  'Physician-led aesthetic medicine.', 'syringe', 50),
  ('spa-wellness',        'Spa & Wellness',      'Massage, IV therapy and regenerative wellness.', 'heart', 60),
  ('cosmetic-dentistry',  'Cosmetic Dentistry',  'Smile makeovers and whitening.', 'smile', 70),
  ('hair-restoration',    'Hair Restoration',    'PRP and non-surgical hair treatments.', 'scissors', 80);

-- ---------- locations (neighbourhoods / suburbs) ----------
insert into public.medspa_locations (id, name, region) values
  ('brickell',       'Brickell',       'Miami, FL'),
  ('coconut-grove',  'Coconut Grove',  'Miami, FL'),
  ('coral-gables',   'Coral Gables',   'Miami, FL'),
  ('wynwood',        'Wynwood',        'Miami, FL');

-- ---------- businesses (example rows) ----------
insert into public.medspa_businesses
  (slug, name, category_id, location_id, description, services, address, phone, email, website,
   price_min, hours, image_hero, image_logo, claimed, featured, status)
values
  (
    'lumiere-aesthetics-brickell',
    'Lumière Aesthetics',
    'med-spa-aesthetic',
    'brickell',
    'Physician-led med-spa specialising in injectables, laser resurfacing and custom skin programs in Brickell.',
    ARRAY['Botox & fillers','Laser resurfacing','Chemical peels','Skin consultations'],
    '1200 Brickell Ave, Suite 410, Miami, FL 33131',
    '+1 305-555-0141',
    'hello@lumiere-aesthetics.com',
    'https://lumiere-aesthetics.com',
    '$$$',
    '{"Mon-Fri":"9am-7pm","Sat":"10am-4pm","Sun":"Closed"}'::jsonb,
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=80',
    '',
    true, true, 'listed'
  ),
  (
    'grove-skin-clinic',
    'Grove Skin Clinic',
    'skin-care',
    'coconut-grove',
    'Dermatologist-supervised skin clinic offering facials, prescription-grade peels and acne programs.',
    ARRAY['Signature facials','Acne programs','Prescription peels','SPF & skincare retail'],
    '2911 Grand Avenue, Coconut Grove, FL 33133',
    '+1 305-555-0187',
    'care@groveskinclinic.com',
    'https://groveskinclinic.com',
    '$$',
    '{"Mon-Fri":"9am-6pm","Sat":"9am-3pm","Sun":"Closed"}'::jsonb,
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80',
    '',
    true, false, 'listed'
  ),
  (
    'contour-brickell',
    'Contour Brickell',
    'body-contouring',
    'brickell',
    'Non-invasive body contouring with CoolSculpting, radiofrequency and guided nutrition.',
    ARRAY['CoolSculpting','Radiofrequency sculpting','Fat-freezing','Progress tracking'],
    '848 Brickell Ave, Miami, FL 33131',
    '+1 305-555-0166',
    'team@contourbrickell.com',
    'https://contourbrickell.com',
    '$$$',
    '{"Mon-Fri":"10am-7pm","Sat":"10am-4pm"}'::jsonb,
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80',
    '',
    false, true, 'listed'
  );

-- ---------- offers (deals / sign-up hook) ----------
insert into public.medspa_offers (id, business_id, title, description, price, code, valid_until, terms, image)
select 'intro-facial-20', b.id, '20% off your first facial',
       'Mention the directory when booking to save 20% on your first signature facial.',
       '$90 → $72', 'DIRECTORY20', '2026-12-31', 'First-time clients only. Cannot combine with other offers.',
       '' from public.medspa_businesses b where b.slug = 'grove-skin-clinic';

insert into public.medspa_offers (id, business_id, title, description, price, code, valid_until, terms, image)
select 'consult-botox-free', b.id, 'Free injectable consultation',
       'Complimentary 20-minute consult with a Nurse Practitioner before any injectable.',
       'Free', 'NOCODE', '2026-12-31', 'Consult only; procedure costs apply as quoted.',
       '' from public.medspa_businesses b where b.slug = 'lumiere-aesthetics-brickell';

-- ---------- posts (spotlight) ----------
insert into public.medspa_posts (id, business_id, title, excerpt, cover, body, published_at)
select 'why-miami-chooses-lumiere', b.id,
       'Why Miami choosedath Lumière', 'How a physician-led model is changing Brickell aesthetics.',
       'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80',
       '<p>Safety and results are the two things patients ask about first.</p><p>Lumière pairs a board-certified physician with experienced injectors so every treatment is reviewed before it touches your skin.</p>',
       now()
from public.medspa_businesses b where b.slug = 'lumiere-aesthetics-brickell';

-- ---------- events (open house) ----------
insert into public.medspa_events (id, business_id, title, starts_at, venue, description, cover)
select 'open-house-skin-check', b.id,
       'Open House: Free Skin Screening Day',
       now() + interval '14 days',
       '2911 Grand Avenue, Coconut Grove',
       'Stop by for a free skin screening, meet the dermatologist and sample our skincare line.',
       'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&q=80'
from public.medspa_businesses b where b.slug = 'grove-skin-clinic';
