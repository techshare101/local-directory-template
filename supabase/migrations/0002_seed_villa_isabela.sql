-- Seed data for Local Directory MVP — Villa Isabela, Dominican Republic instance.
-- Demo/seed content only. Listings are placeholders for the directory MVP;
-- replace with verified real businesses before public launch.

insert into public.categories (id, name, description, icon, sort_order) values
  ('automotive','Automotive','Cars, mechanics and motorbike services.','car',1),
  ('beauty-personal-care','Beauty & Personal Care','Salons, barbers and spa services.','sparkles',2),
  ('community-government','Community & Government','Public services and community groups.','briefcase',3),
  ('education-childcare','Education & Childcare','Schools, tutoring and childcare.','graduation-cap',4),
  ('events-entertainment','Events & Entertainment','Things to do and places to go.','coffee',5),
  ('fitness-recreation','Fitness & Recreation','Gyms, sport and outdoor activity.','dumbbell',6),
  ('food-drink','Food & Drink','Restaurants, cafés and bars.','utensils',7),
  ('health-medical','Health & Medical','Doctors, clinics and wellness.','heart',8),
  ('home-trade-services','Home & Trade Services','Trades, cleaning and home services.','wrench',9),
  ('other-services','Other Services','Everything else.','spray-can',10),
  ('pets-animals','Pets & Animals','Vets, grooming and pet care.','paw-print',11),
  ('professional-services','Professional Services','Law, finance, real estate and more.','building',12)
on conflict (id) do update set name=excluded.name, description=excluded.description, icon=excluded.icon, sort_order=excluded.sort_order;

insert into public.locations (id, name, region) values
  ('villa-isabela','Villa Isabela','Puerto Plata Province, Dominican Republic'),
  ('el-mamey','El Mamey','Puerto Plata Province, Dominican Republic'),
  ('estero-hondo','Estero Hondo','Puerto Plata Province, Dominican Republic'),
  ('luperon','Luperón','Puerto Plata Province, Dominican Republic')
on conflict (id) do update set name=excluded.name, region=excluded.region;

-- Seed businesses (placeholders). status=listed so they are publicly readable.
insert into public.businesses (slug, name, category_id, location_id, description, services, address, phone, email, website, price_min, claimed, featured, status, image_hero, image_logo) values
  ('playa-dorada-dental','Playa Dorada Dental','health-medical','luperon','Modern family dental clinic serving Villa Isabela and the north coast. Fillings, cleanings, whitening and emergency care in a relaxed, bilingual clinic.','Dental cleaning;Whitening;Fillings;Emergency care','Calle Principal 12, Luperón','+1 809-580-1212','hola@playadoradadental.com','playadoradadental.com','$$',false,true,'listed','https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1600&q=80','https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&q=80'),
  ('villa-isabela-market','Gran Mercado Villa Isabela','food-drink','villa-isabela','The welcoming neighbourhood market for fresh produce, meats and everyday essentials.','Fresh produce;Butchery;Bakery;Grocery','Av. 27 de Febrero 45, Villa Isabela','+1 809-580-3456','ventas@granmercado.com','granmercado.com','$',false,true,'listed','https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80','https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=400&q=80'),
  ('cafe-playa-norte','Café Playa Norte','food-drink','villa-isabela','Beachside café with Dominican coffee, fresh juices and light bites just steps from the sand.','Coffee;Fresh juice;Breakfast;Lunch','Calle Litoral 8, Playa Norte','+1 809-580-9876','info@cafeplayanorte.com','cafeplayanorte.com','$',false,true,'listed','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&q=80'),
  ('talleres-german','Talleres German Mecánica','automotive','villa-isabela','Reliable auto and motorbike repair workshop serving Villa Isabela and the north coast.','General repair;Oil change;Tyres;Motorbike service','Carr. Navarrete 210, Villa Isabela','+1 809-580-7788','talleresgerman@gmail.com','','$',false,false,'listed','https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=80',''),
  ('salon-belleza-luz','Salón Belleza Luz','beauty-personal-care','villa-isabela','Full-service hair and beauty salon for women and men. Cuts, colour, manicure and events styling.','Haircut;Colour;Manicure;Bridal styling','Calle Duarte 22, Villa Isabela','+1 809-580-5566','luz@salonbelleza.com','','$',false,false,'listed','https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80',''),
  ('clinica-medica-isabela','Clínica Médica Isabela','health-medical','villa-isabela','Community medical clinic offering general practice, paediatrics and family medicine.','General practice;Paediatrics;Family medicine;Lab work','Av. Independencia 90, Villa Isabela','+1 809-580-2233','clinicaisabela@hotmail.com','','$$',false,false,'listed','https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1600&q=80',''),
  ('escuela-linguavida','Escuela de Español LinguaVida','education-childcare','villa-isabela','Spanish language school for beginners and advanced learners, with small groups and cultural immersion.','Spanish classes;Cultural tours;Online lessons','Calle La Esperanza 5, Villa Isabela','+1 809-580-9900','hola@linguavida.com','linguavida.com','$$',false,false,'listed','https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80',''),
  ('veterinaria-fiel','Veterinaria Fiel','pets-animals','villa-isabela','Caring veterinary clinic for dogs and cats, including vaccination, consultation and grooming.','Vaccination;Consultation;Grooming;Surgery','Calle 30 de Mayo 3, Villa Isabela','+1 809-580-1122','veterinarfiel@yahoo.com','','$',false,false,'listed','https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1600&q=80',''),
  ('inmobiliaria-caribe','Inmobiliaria Caribe','professional-services','estero-hondo','Local real estate agency for land, homes and beachfront property across the north-west coast.','Land sales;Homes;Beachfront;Rental management','Carr. Luperón 55, Estero Hondo','+1 809-580-3344','info@inmobcaribe.com','inmobcaribe.com','$$$',false,true,'listed','https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80',''),
  ('gimnasio-fuertemente','Gimnasio Fuertemente','fitness-recreation','villa-isabela','Community gym with cardio, free weights and group classes for all levels.','Cardio;Free weights;Group classes;Personal training','Calle del Sol 18, Villa Isabela','+1 809-580-6677','gimfuertemente@gmail.com','','$',false,false,'listed','https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',''),
  ('agencia-viajes-norte','Agencia de Viajes Norte','other-services','villa-isabela','Travel agency for domestic and international trips, plus local tours across Puerto Plata province.','Flight booking;Tours;Car hire;Hotel booking','Av. Principal 7, Villa Isabela','+1 809-580-4433','viajesnorte@gmail.com','','$$',false,false,'listed','https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80',''),
  ('constructora-costa-norte','Constructora Costa Norte','home-trade-services','estero-hondo','General construction and renovation for homes and small businesses on the north coast.','Renovation;Construction;Electrical;Plumbing','Carr. Navarrete 340, Estero Hondo','+1 809-580-8899','obras@constructoracostanorte.com','','$$$',false,false,'listed','https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80','')
on conflict (slug) do nothing;

-- Offers
insert into public.offers (id, business_id, title, description, price, code, valid_until, terms, image) values
  ('free-dental-check','playa-dorada-dental','Free Dental Check-up','New patients receive a full check-up and consultation at no charge.','Free','','31 Dec 2026','One per new patient.','https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80'),
  ('market-first-sunday','gran-mercado','Fresh Produce Sunday Special','10% off all fresh fruit and vegetables every first Sunday.','10% off','DOMINGO10','Ongoing','Limit one per customer.','https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80'),
  ('coffee-and-pastry','cafe-playa-norte','Coffee & Pastry Combo','A specialty coffee and a fresh pastry for a discounted price.','RD$150','PLAYA150','31 Dec 2026','Available 8am–11am daily.','https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80')
on conflict (id) do nothing;

-- Posts (local spotlight)
insert into public.posts (id, business_id, title, excerpt, cover, body, published_at) values
  ('announcing-villa-isabela-directory','villa-isabela-market','Welcome to the Villa Isabela Business Directory','Your guide to the best local services, restaurants and experiences in Villa Isabela, Dominican Republic.','https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80','<p>We are building a trusted local directory for Villa Isabela and the surrounding Puerto Plata coast. Browse by category, compare services and support local businesses.</p>', now() - interval '2 days'),
  ('taste-of-the-north-coast','cafe-playa-norte','A Taste of the North Coast: Where Locals Eat','From beachside cafés to family markets, here is where to eat in and around Villa Isabela.','https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80','<p>The north coast rewards slow mornings and fresh ingredients. A few of our favourite spots to start your day or wind it down.</p>', now() - interval '1 day')
on conflict (id) do nothing;

-- Events
insert into public.events (id, business_id, title, starts_at, venue, description, cover) values
  ('villa-isabela-food-festival','cafe-playa-norte','Villa Isabela Food & Culture Festival','2026-12-12T15:00:00Z','Malecón de Villa Isabela','An afternoon of local music, food stalls and community activities along the seafront.','https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'),
  ('farmers-market-sunday','villa-isabela-market','Sunday Farmers Market','2026-11-29T08:00:00Z','Gran Mercado Villa Isabela','Fresh produce, local crafts and live music every Sunday morning.','https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80')
on conflict (id) do nothing;
