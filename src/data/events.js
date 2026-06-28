export const events = [
  {
    id: 'summer-robotics-2026',
    title: 'Summer Robotics Camp 2026',
    type: 'Workshops',
    category: 'Upcoming',
    description: 'A 2-week immersive experience building autonomous robots using Arduino and advanced sensors.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    price: '₹2999',
    duration: '2 Weeks',
    syllabus: [
      'Introduction to Microcontrollers (Arduino Uno)',
      'Basic Circuitry and Component Wiring',
      'Programming Logic and Sensor Integration',
      'Motor Control and Mechanical Assembly',
      'Final Project: Autonomous Maze Solver'
    ],
    kits: ['Arduino Uno Starter Kit', 'Ultrasonic Sensors', 'DC Motors', 'L298N Motor Driver'],
    batches: [
      {
        name: 'Starter',
        level: 'Beginner',
        price: 2999,
        capstone: 'IoT Home Automation Hub and Security Alarm System',
        focus: 'Arduino, Basic Sensors, Logic'
      },
      {
        name: 'Advanced',
        level: 'Intermediate/Advanced',
        price: 3999,
        capstone: 'Smart Obstacle-Avoiding Robot',
        focus: 'ESP32, Wireless IoT, Motor Control'
      }
    ],
    faq: [
      { q: 'Is prior coding experience required?', a: 'No, the Starter batch is designed for beginners.' },
      { q: 'What is the age group?', a: 'Recommended for ages 10-16 for both batches.' }
    ]
  },
  {
    id: 'drone-tech-masterclass',
    title: 'Drone Tech Masterclass',
    type: 'Upcoming',
    category: 'Upcoming',
    description: 'Learn the physics of flight and assemble your own FPV racing drone from scratch.',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
    price: '₹3999',
    duration: '3 Days',
    syllabus: [
      'Aero-dynamics and Flight Theory',
      'Frame Assembly and Soldering',
      'Flight Controller Configuration (Betaflight)',
      'FPV Goggles and Radio Link Pairing',
      'Outdoor Flight Practice'
    ],
    kits: ['Carbon Fiber Frame', 'Brushless Motors', 'ESC Stack', 'FPV Camera'],
    faq: [
      { q: 'Do I get to keep the drone?', a: 'Yes, the registration fee includes the hardware kit.' }
    ]
  },
  {
    id: 'ai-gen-vision-demo',
    title: 'AI & Generative Vision Demo',
    type: 'Workshops',
    category: 'Past',
    description: 'A demonstration of computer vision capabilities in industrial robotics.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    price: 'Free',
    duration: '3 Hours',
    syllabus: [
      'Overview of CNNs and Image Processing',
      'Real-time Object Detection Demo',
      'MediaGeny Custom Tech Stack Showcase'
    ],
    kits: ['Software Access Codes', 'Resource Manual'],
    faq: [
      { q: 'Can I attend virtually?', a: 'This is an in-person demonstration event.' }
    ]
  },
  {
    id: 'iot-smart-home-workshop',
    title: 'IoT & Smart Home Workshop',
    type: 'Workshops',
    category: 'Upcoming',
    description: 'Build your own home automation system using ESP32 and MQTT protocols.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
    price: '₹1999',
    duration: 'Weekend',
    syllabus: [
      'ESP32 Basics and WiFi Connectivity',
      'Sensors and Relays for Automation',
      'Cloud Integration and Mobile Dashboard',
      'Home Assistant Configuration'
    ],
    kits: ['ESP32 DevKit', 'Relay Module', 'Temp/Humidity Sensor'],
    faq: [
      { q: 'Is soldering involved?', a: 'Yes, basic breadboarding and soldering will be taught.' }
    ]
  }
];
