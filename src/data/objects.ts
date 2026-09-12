/**
 * ReVive — sample object database.
 *
 * This is the demo "AI" knowledge base. In production this would be replaced
 * by a real vision model + a curated upcycling API. Every entry is designed to
 * demo well: recognizable object, great ideas, honest impact numbers.
 */

export type Difficulty = 'Easy' | 'Medium' | 'Advanced'

export interface Step {
  title: string
  detail: string
}

/** A deep-dive project (the "best idea" with full instructions). */
export interface Project {
  /** Idea id this project expands on */
  ideaId: string
  materials: string[]
  tools: string[]
  difficulty: Difficulty
  timeMinutes: number
  estimatedCostUsd: number
  steps: Step[]
  tip: string
}

export interface Idea {
  id: string
  emoji: string
  title: string
  blurb: string
  /** Relative impact multiplier used for the impact math */
  impactFactor: number
  /** Populated for the recommended idea */
  project?: Project
}

export interface DetectedObject {
  id: string
  name: string
  emoji: string
  /** Extra keywords the mock matcher can hit on */
  aliases: string[]
  category: string
  tagline: string
  /** Second Life Score 0-100 */
  score: number
  /** Landfill waste diverted when the recommended idea is completed */
  baseWasteKg: number
  /** Money saved vs. buying the equivalent new item */
  baseSavingsUsd: number
  /** Shown as a small caption on the result card */
  sourceHint: string
  ideas: Idea[]
}

export const OBJECTS: DetectedObject[] = [
  {
    id: 'plastic-bottle',
    name: 'Plastic Bottle',
    emoji: '🧴',
    aliases: ['bottle', 'water bottle', 'pet bottle', 'soda bottle'],
    category: 'Plastic · PET',
    tagline: 'One of the most versatile upcycling materials on the planet.',
    score: 92,
    baseWasteKg: 0.05,
    baseSavingsUsd: 4,
    sourceHint: 'Looks like a standard 500 ml PET bottle — fully cleanable, easy to cut.',
    ideas: [
      {
        id: 'planter',
        emoji: '🌱',
        title: 'Self-watering planter',
        blurb: 'A wicking planter that waters your herbs for up to a week — perfect for kitchen windowsills.',
        impactFactor: 1,
        project: {
          ideaId: 'planter',
          materials: ['1 plastic bottle (500 ml–1 L)', 'Cotton string or an old shoelace', 'Potting soil', 'A small herb seedling or seeds'],
          tools: ['Scissors', 'Marker'],
          difficulty: 'Easy',
          timeMinutes: 20,
          estimatedCostUsd: 2,
          steps: [
            { title: 'Cut the bottle', detail: 'Mark the bottle about two-thirds up and cut all the way around. Keep both halves.' },
            { title: 'Make the wick', detail: 'Thread the cotton string through the bottle cap from the inside, leaving ~10 cm hanging out. Screw the cap back on.' },
            { title: 'Assemble', detail: 'Flip the top half upside down and rest it inside the bottom half. The string should dangle into the reservoir below.' },
            { title: 'Fill', detail: 'Add soil and your seedling in the top. Pour water into the bottom reservoir — the wick feeds the plant continuously.' },
            { title: 'Place & enjoy', detail: 'Set it on a sunny windowsill. Refill the reservoir every 5–7 days.' },
          ],
          tip: 'Paint the outside with leftover acrylics to block algae growth and add personality.',
        },
      },
      {
        id: 'storage',
        emoji: '🏠',
        title: 'DIY storage container',
        blurb: 'Cut and stacked bottles become modular drawers for desk supplies.',
        impactFactor: 0.7,
        project: {
          ideaId: 'storage',
          materials: ['2–4 clean plastic bottles', 'Glue or double-sided tape', 'Optional: zipper, felt, or paint'],
          tools: ['Scissors', 'Marker'],
          difficulty: 'Easy',
          timeMinutes: 25,
          estimatedCostUsd: 1,
          steps: [
            { title: 'Cut the bottles', detail: 'Cut each bottle 10–12 cm from the base — these become the drawer trays.' },
            { title: 'Sand the edges', detail: 'Rub the cut rim with fine sandpaper or a nail file so nothing scratches.' },
            { title: 'Stack the trays', detail: 'Glue bottle bases on top of each other, rim side up, offset like a chest of drawers.' },
            { title: 'Add fronts (optional)', detail: 'Glue a felt or cardboard strip to one side of each tray as a pull-out front.' },
            { title: 'Load up', detail: 'Sort pens, cables, and erasers into the trays. Labels on the fronts keep it tidy.' },
          ],
          tip: 'Bases of different diameters nest — put the widest at the bottom for a stable tower.',
        },
      },
      {
        id: 'decor',
        emoji: '🎨',
        title: 'Decorative plant holder',
        blurb: 'A painted bottle sleeve that turns any glass into a designer pot.',
        impactFactor: 0.6,
        project: {
          ideaId: 'decor',
          materials: ['1 plastic bottle', 'Acrylic paints', 'Optional: twine or fabric scraps'],
          tools: ['Scissors', 'Paintbrush'],
          difficulty: 'Easy',
          timeMinutes: 30,
          estimatedCostUsd: 2,
          steps: [
            { title: 'Cut the sleeve', detail: 'Cut the top third off the bottle; keep the base as the planter body.' },
            { title: 'Drainage', detail: 'Poke 3–4 small holes in the base so roots never sit in water.' },
            { title: 'Paint', detail: 'Paint the outside in bold blocks, stripes, or dots. Two thin coats beat one thick one.' },
            { title: 'Seal the look', detail: 'Once dry, wrap twine around the rim or glue on fabric shapes for texture.' },
            { title: 'Pot your plant', detail: 'Drop in a small plant in its nursery pot — the sleeve becomes the decorative cache-pot.' },
          ],
          tip: 'Paint dries faster on plastic if you wipe the bottle with vinegar first.',
        },
      },
    ],
  },
  {
    id: 'cardboard-box',
    name: 'Cardboard Box',
    emoji: '📦',
    aliases: ['cardboard', 'box', 'shipping box', 'carton'],
    category: 'Paper · Corrugated',
    tagline: 'Shipping boxes are engineered to be strong — put that engineering to work.',
    score: 88,
    baseWasteKg: 0.55,
    baseSavingsUsd: 12,
    sourceHint: 'Corrugated cardboard, single-wall. Dry and clean — ideal for crafting.',
    ideas: [
      {
        id: 'organizer',
        emoji: '🗂️',
        title: 'Desk organizer set',
        blurb: 'Cut a box into modular trays and wrap them in leftover fabric or kraft paper.',
        impactFactor: 1,
        project: {
          ideaId: 'organizer',
          materials: ['1 medium cardboard box', 'Kraft paper, fabric, or wrapping paper', 'White glue or a glue stick'],
          tools: ['Box cutter', 'Metal ruler', 'Pencil'],
          difficulty: 'Easy',
          timeMinutes: 45,
          estimatedCostUsd: 3,
          steps: [
            { title: 'Plan the layout', detail: 'Sketch 3–4 trays of different heights: pens, cables, sticky notes.' },
            { title: 'Cut the panels', detail: 'Use the ruler as a straightedge and score the cardboard lightly before cutting through.' },
            { title: 'Fold the trays', detail: 'Score fold lines, fold up the walls, and glue the corner tabs. Clamp with binder clips while drying.' },
            { title: 'Wrap it', detail: 'Glue paper or fabric over each tray, folding edges neatly like a gift.' },
            { title: 'Arrange', detail: 'Line the trays up inside a drawer or on your desk in a grid.' },
          ],
          tip: 'Spray the finished trays with clear varnish so they last for years, not months.',
        },
      },
      {
        id: 'cat-house',
        emoji: '🐱',
        title: 'Cozy pet house',
        blurb: 'A carpeted cardboard castle your cat will inexplicably prefer to its bed.',
        impactFactor: 1.4,
        project: {
          ideaId: 'cat-house',
          materials: ['1–2 large sturdy cardboard boxes', 'Old blanket, fleece, or towel', 'Non-toxic glue'],
          tools: ['Box cutter', 'Ruler', 'Pencil'],
          difficulty: 'Medium',
          timeMinutes: 60,
          estimatedCostUsd: 2,
          steps: [
            { title: 'Size the door', detail: 'Draw a doorway on one face — roughly 15 × 15 cm for a cat, higher than wide.' },
            { title: 'Cut & reinforce', detail: 'Cut out the door, then glue extra cardboard strips behind every wall seam.' },
            { title: 'Insulate', detail: 'Line the floor and walls with the blanket so the box feels like a cave, not cardboard.' },
            { title: 'Two-room option', detail: 'Join a second box with a connecting hole for a deluxe suite.' },
            { title: 'Placement', detail: 'Put it somewhere quiet and slightly elevated — cats judge real estate harshly.' },
          ],
          tip: 'Rub a little catnip on the bedding to fast-track official approval.',
        },
      },
      {
        id: 'compost',
        emoji: '🥬',
        title: 'Compost bin browns',
        blurb: 'Shredded cardboard balances your compost’s nitrogen — zero effort.',
        impactFactor: 0.8,
        project: {
          ideaId: 'compost',
          materials: ['Clean cardboard (no glossy print, no tape)', 'Compost bin or heap'],
          tools: ['Scissors or paper shredder', 'Water spray bottle'],
          difficulty: 'Easy',
          timeMinutes: 10,
          estimatedCostUsd: 0,
          steps: [
            { title: 'Strip the tape', detail: 'Remove any plastic tape and staples — only pure cardboard goes in.' },
            { title: 'Shred small', detail: 'Tear or shred into strips a few centimeters wide; small pieces break down much faster.' },
            { title: 'Layer it', detail: 'Add a handful of “browns” every time you add food scraps — roughly 2 parts browns to 1 part greens.' },
            { title: 'Dampen', detail: 'Spray lightly so it feels like a wrung-out sponge. Dry browns stall the pile.' },
            { title: 'Turn & repeat', detail: 'Mix the pile every week or two; shredded cardboard also makes excellent worm-farm bedding.' },
          ],
          tip: 'Egg cartons count as browns too — tear them straight into the caddy.',
        },
      },
    ],
  },
  {
    id: 'glass-jar',
    name: 'Glass Jar',
    emoji: '🫙',
    aliases: ['jar', 'mason jar', 'glass', 'pickle jar'],
    category: 'Glass · Food grade',
    tagline: 'The king of reuse: endlessly washable, airtight, and always in style.',
    score: 95,
    baseWasteKg: 0.2,
    baseSavingsUsd: 8,
    sourceHint: 'Screw-top glass jar with intact lid and seal — food safe.',
    ideas: [
      {
        id: 'pantry',
        emoji: '🥣',
        title: 'Pantry storage system',
        blurb: 'Decant rice, pasta, oats and spices into jars for a zero-waste pantry that stays fresh.',
        impactFactor: 1,
        project: {
          ideaId: 'pantry',
          materials: ['Clean glass jars with lids', 'Masking tape or a label maker', 'Optional: chalk marker'],
          tools: ['Warm soapy water', 'Sponge'],
          difficulty: 'Easy',
          timeMinutes: 15,
          estimatedCostUsd: 0,
          steps: [
            { title: 'De-label', detail: 'Soak jars in warm soapy water for 15 minutes; adhesive peels right off.' },
            { title: 'Sterilize', detail: 'Rinse with hot water and air-dry fully, upside down, on a rack.' },
            { title: 'Decant', detail: 'Fill with dry goods: grains, pasta, nuts, spices, tea.' },
            { title: 'Label', detail: 'Write contents (and buy-dates) on tape or with a chalk marker.' },
            { title: 'Shelf it', detail: 'Group jars by height on open shelves — function becomes decoration.' },
          ],
          tip: 'A bay leaf in the rice jar keeps pantry moths away — grandma was right.',
        },
      },
      {
        id: 'lamp',
        emoji: '💡',
        title: 'Fairy-light lantern',
        blurb: 'A string of LEDs inside a jar = instant cozy lighting for under $2.',
        impactFactor: 0.7,
        project: {
          ideaId: 'lamp',
          materials: ['1 clean glass jar', 'Battery LED string lights (fairy lights)', 'Optional: wire or twine for hanging'],
          tools: ['None — maybe scissors for the twine'],
          difficulty: 'Easy',
          timeMinutes: 10,
          estimatedCostUsd: 2,
          steps: [
            { title: 'Clean & dry', detail: 'Wash the jar and let it dry fully — moisture and electronics don’t mix.' },
            { title: 'Fluff the lights', detail: 'Battery pack outside, gently coil the light string inside the jar around your finger as you go.' },
            { title: 'Hide the pack', detail: 'Tuck the battery pack under the rim at the back, or hot-glue a small hook inside the lid.' },
            { title: 'Dress the lid', detail: 'Twine around the jar neck or a strip of fabric under the lid ring adds instant charm.' },
            { title: 'Set the mood', detail: 'Group three jars of different heights for a dinner-table centerpiece.' },
          ],
          tip: 'Use warm-white LEDs outdoors on a porch — they attract fewer bugs than cool white.',
        },
      },
      {
        id: 'vase',
        emoji: '🌸',
        title: 'Bud vase or terrarium',
        blurb: 'Small jars make perfect single-stem vases or moss terrariums.',
        impactFactor: 0.6,
        project: {
          ideaId: 'vase',
          materials: ['1 small glass jar', 'Pebbles or gravel', 'Activated charcoal (optional)', 'Potting soil', 'Small plants or moss'],
          tools: ['Spoon or small trowel'],
          difficulty: 'Easy',
          timeMinutes: 20,
          estimatedCostUsd: 3,
          steps: [
            { title: 'Vase route', detail: 'Add water and a single stem — gerbera daisies in short jars look intentionally designer.' },
            { title: 'Terrarium route', detail: 'Layer: pebbles for drainage, a pinch of charcoal to keep it fresh, then damp soil.' },
            { title: 'Plant it', detail: 'Add small moss cushions or tiny plants; mist lightly to settle them.' },
            { title: 'Choose its home', detail: 'Bright indirect light. Sealed jars rarely need watering; open ones need a mist weekly.' },
          ],
          tip: 'Condensation on a closed terrarium means it’s watered — wipe the glass and leave it be.',
        },
      },
    ],
  },
  {
    id: 't-shirt',
    name: 'Old T-Shirt',
    emoji: '👕',
    aliases: ['shirt', 'tshirt', 't-shirt', 'tee', 'clothes', 'clothing'],
    category: 'Textile · Cotton',
    tagline: 'Every year 2 billion T-shirts are thrown away. Yours doesn’t have to join them.',
    score: 85,
    baseWasteKg: 0.25,
    baseSavingsUsd: 10,
    sourceHint: 'Soft cotton jersey — color will fade beautifully in sun projects.',
    ideas: [
      {
        id: 'tote',
        emoji: '👜',
        title: 'No-sew tote bag',
        blurb: 'Cut, knot, done — a grocery bag in 10 minutes with zero sewing. A classic first upcycle.',
        impactFactor: 1,
        project: {
          ideaId: 'tote',
          materials: ['1 old T-shirt', 'Fabric scissors'],
          tools: ['Scissors', 'Chalk or marker'],
          difficulty: 'Easy',
          timeMinutes: 10,
          estimatedCostUsd: 0,
          steps: [
            { title: 'Cut the sleeves', detail: 'Cut along the sleeve seams to create the armholes of your bag. Cut wider for a slouchier tote.' },
            { title: 'Cut the neckline', detail: 'Cut a deeper curve at the collar — this becomes the bag’s opening.' },
            { title: 'Decide the depth', detail: 'Decide how deep the bag should be (usually ~35 cm) and mark a line at the bottom.' },
            { title: 'Fringe the bottom', detail: 'Cut 2–3 cm vertical strips through both layers along the bottom, front and back.' },
            { title: 'Knot & flip', detail: 'Tie each front strip to the matching back strip with a double knot. Flip the bag inside out to hide the knots.' },
          ],
          tip: 'Thicker shirts make sturdier bags — or layer two shirts for heavy grocery duty.',
        },
      },
      {
        id: 'yarn',
        emoji: '🧶',
        title: 'T-shirt yarn',
        blurb: 'One spiral cut turns a tee into 30 m of chunky yarn for weaving or macramé.',
        impactFactor: 0.9,
        project: {
          ideaId: 'yarn',
          materials: ['1–3 old T-shirts'],
          tools: ['Fabric scissors', 'Fabric marker or chalk'],
          difficulty: 'Easy',
          timeMinutes: 20,
          estimatedCostUsd: 0,
          steps: [
            { title: 'Square off', detail: 'Cut off the hem and the top (sleeves + neckline) so you’re left with a tube of fabric.' },
            { title: 'Fold & mark', detail: 'Fold the tube, leaving a 3–4 cm uncut margin at the top. Mark diagonal lines about 2 cm apart.' },
            { title: 'First cut', detail: 'Cut along the marks, stopping at the margin every time — the strips stay connected at the fold.' },
            { title: 'The magic spiral', detail: 'Unfold. Cut diagonally from the first strip’s edge to the second’s, and keep going: one continuous ribbon.' },
            { title: 'Stretch it', detail: 'Pull the yarn firmly — the curls stretch into chunky, rope-like t-shirt yarn, ready to knit or weave.' },
          ],
          tip: 'Join two balls by slotting the ends together and pulling — no sewing needed.',
        },
      },
      {
        id: 'rags',
        emoji: '🧽',
        title: 'Zero-waste cleaning rags',
        blurb: 'Replace paper towels forever — one shirt ≈ 60 rolls.',
        impactFactor: 0.6,
        project: {
          ideaId: 'rags',
          materials: ['Worn-out T-shirts or other cotton clothing', 'Optional: storage basket or small bin'],
          tools: ['Scissors'],
          difficulty: 'Easy',
          timeMinutes: 5,
          estimatedCostUsd: 0,
          steps: [
            { title: 'Cut squares', detail: 'Snip the fabric into 15 × 15 cm squares — big enough to wipe, small enough to rinse out.' },
            { title: 'Stage them', detail: 'Fold a stack where paper towels used to live. Behavior change beats willpower.' },
            { title: 'Use & rinse', detail: 'Wipe spills, rinse under the tap, wring, hang over the oven handle or a hook to dry.' },
            { title: 'Launder weekly', detail: 'Toss the week’s rags in a hot wash with the towels. Skip fabric softener — it kills absorbency.' },
          ],
          tip: 'Keep a second stack for greasy jobs only — it saves your good rags from oil buildup.',
        },
      },
    ],
  },
  {
    id: 'tin-can',
    name: 'Tin Can',
    emoji: '🥫',
    aliases: ['can', 'tin', 'soup can', 'beans can'],
    category: 'Metal · Steel',
    tagline: 'Food-grade steel with a handle just waiting to exist.',
    score: 90,
    baseWasteKg: 0.08,
    baseSavingsUsd: 5,
    sourceHint: 'Standard steel food can — check the rim is smooth before crafting.',
    ideas: [
      {
        id: 'lantern',
        emoji: '🕯️',
        title: 'Punched-tin lantern',
        blurb: 'A pattern of drilled holes turns a can into a candle lantern that throws starlight on the walls.',
        impactFactor: 1,
        project: {
          ideaId: 'lantern',
          materials: ['1 clean tin can', 'Wire for a hanger (optional)', 'Tea light candle'],
          tools: ['Hammer', 'Nail or awl', 'Pliers'],
          difficulty: 'Medium',
          timeMinutes: 35,
          estimatedCostUsd: 1,
          steps: [
            { title: 'Fill with water & freeze', detail: 'Fill the can with water and freeze overnight — ice stops the metal denting while you punch.' },
            { title: 'Mark the pattern', detail: 'Draw dots in your pattern (stars, initials, hearts) with a marker.' },
            { title: 'Punch the holes', detail: 'On a towel, hammer a nail through each dot. Vary hole sizes for different light effects.' },
            { title: 'Add the hanger', detail: 'Punch two holes near the rim opposite each other; thread wire through and twist a loop handle.' },
            { title: 'Light it', detail: 'Let the ice melt, dry the can, drop in a tea light — done.' },
          ],
          tip: 'Make a set of five in graduating heights for a stunning table centerpiece.',
        },
      },
      {
        id: 'planter2',
        emoji: '🌿',
        title: 'Herb garden row',
        blurb: 'A windowsill herb garden with drainage holes — basil, mint, chives.',
        impactFactor: 0.8,
        project: {
          ideaId: 'planter2',
          materials: ['3–5 clean tin cans', 'Potting soil', 'Herb seedlings or seeds', 'Optional: paint or rope to wrap'],
          tools: ['Hammer + nail (for drainage holes)', 'Sandpaper'],
          difficulty: 'Easy',
          timeMinutes: 30,
          estimatedCostUsd: 4,
          steps: [
            { title: 'Safety first', detail: 'Check rims are smooth; sand any sharp edges and wash out all food residue.' },
            { title: 'Drainage', detail: 'Hammer 3–4 nail holes into each can’s base so roots never sit in water.' },
            { title: 'Dress them', detail: 'Paint the outsides, or wrap with rope and glue for a farmhouse look. Label each herb.' },
            { title: 'Plant', detail: 'Fill with soil, plant your herbs, water gently. Mint needs its own can — it spreads.' },
            { title: 'Sunny window', detail: 'Line them on the brightest sill you have; snip herbs often to keep them bushy.' },
          ],
          tip: 'Freeze extra chopped herbs with olive oil in an ice tray for instant cooking portions.',
        },
      },
      {
        id: 'utensils',
        emoji: '🍴',
        title: 'Utensil crock',
        blurb: 'Rope-wrapped cans become rustic countertop utensil holders.',
        impactFactor: 0.6,
        project: {
          ideaId: 'utensils',
          materials: ['1 large tin can (800 g size)', 'Hot glue gun + glue sticks', 'Jute rope or thick cotton cord'],
          tools: ['Hot glue gun', 'Scissors'],
          difficulty: 'Easy',
          timeMinutes: 25,
          estimatedCostUsd: 2,
          steps: [
            { title: 'Prep the can', detail: 'Wash, dry, and check the rim. A plastic lid on top removes any sharp edge worries.' },
            { title: 'Anchor the rope', detail: 'Glue the rope’s end just inside the bottom rim — this anchor hides all later ends.' },
            { title: 'Wrap tight', detail: 'Spiral upward, adding a thin bead of glue every few turns. Keep the rows snug, no gaps.' },
            { title: 'Finish the top', detail: 'Glue the final end inside the top rim, trimming any fuzzy rope ends.' },
            { title: 'Load it', detail: 'Fill with wooden spoons, whisks, or paintbrushes. Make a trio for the whole counter.' },
          ],
          tip: 'Wrap a contrasting colored rope around the middle for a stripe — takes 2 extra minutes.',
        },
      },
    ],
  },
  {
    id: 'wooden-pallet',
    name: 'Wooden Pallet',
    emoji: '🪵',
    aliases: ['pallet', 'wood', 'wooden', 'planks'],
    category: 'Wood · Reclaimed',
    tagline: 'Free lumber hiding in plain sight behind every warehouse.',
    score: 87,
    baseWasteKg: 18,
    baseSavingsUsd: 45,
    sourceHint: 'Heat-treated pallet (look for the “HT” stamp — safe for indoor projects).',
    ideas: [
      {
        id: 'shelf',
        emoji: '📚',
        title: 'Rustic wall shelf',
        blurb: 'Two pallet boards become an industrial-chic shelf with rope accents.',
        impactFactor: 1,
        project: {
          ideaId: 'shelf',
          materials: ['2 pallet boards (~60 cm)', 'Sturdy rope or leather straps', 'Wall anchors + screws'],
          tools: ['Sander or sandpaper', 'Drill', 'Level'],
          difficulty: 'Medium',
          timeMinutes: 90,
          estimatedCostUsd: 6,
          steps: [
            { title: 'Pry the boards', detail: 'Use a pry bar to separate boards from the pallet. Work slowly to avoid splitting.' },
            { title: 'Remove nails & sand', detail: 'Pull or hammer flat every nail. Sand with 80- then 120-grit until smooth to the touch.' },
            { title: 'Finish the wood', detail: 'Wipe on linseed oil or furniture wax to bring out the grain and protect the surface.' },
            { title: 'Mount the ropes', detail: 'Fix two rope loops to wall anchors at your desired height. Check with a level.' },
            { title: 'Rest the shelves', detail: 'Lay boards across the loops, adjust to horizontal, load with books or plants.' },
          ],
          tip: 'Only use pallets stamped “HT” (heat-treated) — never “MB”, which means chemical fumigation.',
        },
      },
      {
        id: 'coffee-table',
        emoji: '🛋️',
        title: 'Pallet coffee table',
        blurb: 'One pallet + four casters = a living room table for the cost of wheels.',
        impactFactor: 1.6,
        project: {
          ideaId: 'coffee-table',
          materials: ['1 whole pallet (HT stamp)', '4 heavy-duty casters with mounting plates', 'Wood screws', 'Optional: glass top, paint, or oil finish'],
          tools: ['Drill + bits', 'Sandpaper or orbital sander', 'Screwdriver'],
          difficulty: 'Medium',
          timeMinutes: 120,
          estimatedCostUsd: 20,
          steps: [
            { title: 'Inspect & clean', detail: 'Choose an HT-stamped pallet. Sand splinters and wipe off warehouse dust.' },
            { title: 'Decide the height', detail: 'Most pallets sit ~14 cm high — perfect. Add caster height if you want more knee room.' },
            { title: 'Mount the casters', detail: 'Fix one caster into each corner block with screws. Locking casters stop coffee-table drift.' },
            { title: 'Finish the top', detail: 'Oil or paint the wood. A cut-to-size glass sheet on top gives a smooth, wipeable surface.' },
            { title: 'Style it', detail: 'The middle gap is a bonus shelf — stack art books or slide in a woven basket for remotes.' },
          ],
          tip: 'Two stacked pallets make a taller, chunkier table — double the casters, double the wow.',
        },
      },
      {
        id: 'garden-path',
        emoji: '🪴',
        title: 'Garden walkway',
        blurb: 'Dismantled planks become a charming garden path that costs nothing.',
        impactFactor: 1.2,
        project: {
          ideaId: 'garden-path',
          materials: ['Pallet planks', 'Sand or gravel for the base', 'Optional: exterior wood oil'],
          tools: ['Pry bar + hammer', 'Saw', 'Spade', 'Level'],
          difficulty: 'Medium',
          timeMinutes: 180,
          estimatedCostUsd: 10,
          steps: [
            { title: 'Harvest the boards', detail: 'Pry pallets apart carefully; pull or hammer flat every nail.' },
            { title: 'Cut to length', detail: 'Cut planks to equal lengths — 50–60 cm steps suit a natural stride.' },
            { title: 'Level the route', detail: 'Mark the path, remove grass, and level each spot with a shallow sand or gravel bed.' },
            { title: 'Lay the boards', detail: 'Press planks flat into the beds, leaving 3–4 cm gaps for drainage and bare feet. Check with a level.' },
            { title: 'Oil for longevity', detail: 'A coat of exterior oil doubles the life of the wood. Reapply once a year.' },
          ],
          tip: 'Lay boards on a gentle curve — it makes even a tiny garden feel like a journey.',
        },
      },
    ],
  },
  {
    id: 'plastic-container',
    name: 'Plastic Container',
    emoji: '🥡',
    aliases: ['container', 'tupperware', 'takeout', 'tub', 'yogurt tub'],
    category: 'Plastic · PP / HDPE',
    tagline: 'Takeout containers are the gateway drug to organized drawers.',
    score: 78,
    baseWasteKg: 0.06,
    baseSavingsUsd: 3,
    sourceHint: 'Rigid food container, likely polypropylene — dishwasher safe.',
    ideas: [
      {
        id: 'drawer-org',
        emoji: '🧰',
        title: 'Drawer organizer grid',
        blurb: 'Mismatched containers become a custom-fit organizer for any junk drawer.',
        impactFactor: 1,
        project: {
          ideaId: 'drawer-org',
          materials: ['3–6 clean plastic containers', 'Optional: peel-and-stick felt'],
          tools: ['Scissors (to trim height)'],
          difficulty: 'Easy',
          timeMinutes: 15,
          estimatedCostUsd: 0,
          steps: [
            { title: 'Empty the drawer', detail: 'Yes, all of it. Group similar items together and be honest about the takeout soy sauce packets.' },
            { title: 'Match containers', detail: 'Pick containers that fit each group: cables, batteries, pens, first aid.' },
            { title: 'Trim to fit', detail: 'Cut tall containers down so everything sits at the same height in the drawer.' },
            { title: 'Arrange the grid', detail: 'Fit containers side by side like a puzzle — no wasted space.' },
            { title: 'Line & load', detail: 'Optional: felt lining for a premium look. Reload the drawer.' },
          ],
          tip: 'Label the lids’ edge so everyone in the house puts things back where they belong.',
        },
      },
      {
        id: 'seedling',
        emoji: '🌱',
        title: 'Seedling starters',
        blurb: 'Drainage holes + soil = a free greenhouse tray for your garden.',
        impactFactor: 0.8,
        project: {
          ideaId: 'seedling',
          materials: ['Clear-lidded plastic containers', 'Potting soil', 'Seeds', 'Optional: plant labels'],
          tools: ['Nail or skewer (for holes)', 'Spray bottle'],
          difficulty: 'Easy',
          timeMinutes: 15,
          estimatedCostUsd: 1,
          steps: [
            { title: 'Ventilate', detail: 'Poke drainage holes in the base and a few air holes in the clear lid.' },
            { title: 'Sow', detail: 'Fill with damp soil to 2 cm from the top; press in seeds at packet depth.' },
            { title: 'Seal the greenhouse', detail: 'Close the lid — it traps humidity so you barely water until sprouting.' },
            { title: 'Light & warmth', detail: 'Place somewhere bright and warm. Open the lid for 10 min daily to prevent mold.' },
            { title: 'Pot up', detail: 'When seedlings have 2–3 true leaves, transplant — the soft plastic flexes them out intact.' },
          ],
          tip: 'Clear berry or salad containers with lids are ideal — free mini-greenhouses with handles.',
        },
      },
      {
        id: 'paint-pot',
        emoji: '🎨',
        title: 'Paint & craft pots',
        blurb: 'The perfect size for paints, beads, screws — and they stack.',
        impactFactor: 0.5,
        project: {
          ideaId: 'paint-pot',
          materials: ['Clean yogurt/takeout tubs with lids', 'Optional: peel-and-stick labels'],
          tools: ['None'],
          difficulty: 'Easy',
          timeMinutes: 10,
          estimatedCostUsd: 0,
          steps: [
            { title: 'Sort by size', detail: 'Group tubs: small for beads and screws, larger for brushes and crayons.' },
            { title: 'Label the lids', detail: 'Label the lid’s edge so a stacked set is readable from above.' },
            { title: 'Kit them out', detail: 'Build a craft kit per tub — painting, sewing, repair — grab-and-go style.' },
            { title: 'Stack & store', detail: 'Same-size tubs stack in a drawer; mixed sizes slot into a shoebox like a puzzle.' },
          ],
          tip: 'One tub with a marble inside becomes a shaker for glitter, salt, or sugar in the kitchen.',
        },
      },
    ],
  },
]

/** Deterministic rotation so every scan in the demo feels fresh. */
export function pickObject(scanCount: number): DetectedObject {
  return OBJECTS[scanCount % OBJECTS.length]
}
