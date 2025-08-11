import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Home,
  User,
  Settings,
  FileText,
  BarChart3,
  Mail,
  Image as ImageIcon,
  Calendar,
  Upload,
  Eye,
  Shield,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Percent,
  Star,
  Clock,
  Users,
  Building,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Edit,
  Trash2,
  Plus,
  Send,
  Check,
  AlertCircle,
  Share2,
  Link as LinkIcon,
  Lock,
  Activity,
  Phone,
  Briefcase,
  Bookmark,
  MessageSquare,
  Printer,
  Crown,
  QrCode,
  FolderOpen,
  Palette,
  Flag,
  Maximize,
  Minimize,
  Globe,
  Save,
  XCircle,
  CheckCircle,
  Bot,
  Wand2,
  Type,
  MousePointer,
  LayoutTemplate,
  UserCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// --- Draggable & Resizable Element Component ---
const CanvasElement = ({ data, onUpdate, onSelect, isSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const elementRef = useRef(null);

  const handleMouseDown = (e, action) => {
    e.stopPropagation();
    onSelect(data.id);
    setInitialPos({ x: e.clientX, y: e.clientY });

    if (action === "drag") {
      setIsDragging(true);
    } else {
      setIsResizing(action);
      const rect = elementRef.current.getBoundingClientRect();
      setInitialSize({ width: rect.width, height: rect.height });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - initialPos.x;
        const dy = e.clientY - initialPos.y;
        onUpdate(data.id, { x: data.x + dx, y: data.y + dy });
        setInitialPos({ x: e.clientX, y: e.clientY });
      } else if (isResizing) {
        const dx = e.clientX - initialPos.x;
        const dy = e.clientY - initialPos.y;
        let newWidth = initialSize.width;
        let newHeight = initialSize.height;
        let newX = data.x;
        let newY = data.y;

        if (isResizing.includes("right")) newWidth = initialSize.width + dx;
        if (isResizing.includes("bottom")) newHeight = initialSize.height + dy;
        if (isResizing.includes("left")) {
          newWidth = initialSize.width - dx;
          newX = data.x + dx;
        }
        if (isResizing.includes("top")) {
          newHeight = initialSize.height - dy;
          newY = data.y + dy;
        }

        onUpdate(data.id, {
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, initialPos, initialSize, data, onUpdate]);

  const renderContent = () => {
    const fontClass = data.styles?.fontFamily || "font-serif";
    switch (data.type) {
      case "text":
        return (
          <div
            style={{
              fontSize: `${data.styles.fontSize}px`,
              color: data.styles.color,
              textAlign: data.styles.textAlign,
            }}
            className={`w-full h-full p-2 box-border ${fontClass}`}
          >
            {data.content}
          </div>
        );
      case "image":
        return (
          <img
            src={data.content}
            alt="property"
            className="w-full h-full object-cover"
            style={{
              border: `${data.styles.borderWidth}px solid ${data.styles.borderColor}`,
            }}
          />
        );
      case "qr":
        return (
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.content}`}
            alt="QR Code"
            className="w-full h-full"
          />
        );
      default:
        return null;
    }
  };

  const resizeHandles = [
    { cursor: "nwse-resize", position: "top-0 left-0", action: "top-left" },
    { cursor: "nesw-resize", position: "top-0 right-0", action: "top-right" },
    {
      cursor: "nesw-resize",
      position: "bottom-0 left-0",
      action: "bottom-left",
    },
    {
      cursor: "nwse-resize",
      position: "bottom-0 right-0",
      action: "bottom-right",
    },
  ];

  return (
    <div
      ref={elementRef}
      className={`absolute ${
        isSelected
          ? "border-2 border-dashed border-coral-500"
          : "border-2 border-transparent"
      } hover:border-coral-300`}
      style={{
        left: data.x,
        top: data.y,
        width: data.width,
        height: data.height,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={(e) => handleMouseDown(e, "drag")}
    >
      {renderContent()}
      {isSelected &&
        resizeHandles.map((handle) => (
          <div
            key={handle.action}
            className={`absolute w-3 h-3 bg-white border border-coral-500 rounded-full -m-1.5 ${handle.position}`}
            style={{ cursor: handle.cursor }}
            onMouseDown={(e) => handleMouseDown(e, handle.action)}
          />
        ))}
    </div>
  );
};

// --- MARKETING SUITE COMPONENTS ---

const AIFlyerDesigner = ({ userListings, currentUser, onFlyerSave }) => {
  const [selectedListingId, setSelectedListingId] = useState(
    userListings[0]?.id || null
  );
  const [prompt, setPrompt] = useState(
    "A modern, elegant flyer for a weekend open house, highlighting the seller's offer to contribute to the buyer's agent commission."
  );
  const [style, setStyle] = useState("Modern");
  const [includeQr, setIncludeQr] = useState(true);
  const [includeHeadshot, setIncludeHeadshot] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFlyer, setGeneratedFlyer] = useState(null);

  const selectedListing = userListings.find((l) => l.id === selectedListingId);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedFlyer(null);
    setTimeout(() => {
      setGeneratedFlyer({
        headline: "Luxury Living in San Francisco",
        body: "Join us for an exclusive open house this Saturday & Sunday from 1-4 PM. Discover your dream home with breathtaking views and modern amenities. The seller is offering a 2.5% concession to be used for buyer's agent commission or closing costs.",
        style: style,
        includesQr: includeQr,
        includesHeadshot: includeHeadshot,
      });
      setIsGenerating(false);
    }, 1500);
  };

  useEffect(() => {
    setGeneratedFlyer(null);
  }, [selectedListingId]);

  if (!selectedListing) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-slate-800">AI Flyer Designer</h2>
        <p className="text-slate-600 mt-4">
          You have no listings to create a flyer for.
        </p>
      </div>
    );
  }

  const FlyerPreview = () => (
    <div className="border rounded-lg p-4 bg-white flex flex-col h-full shadow-inner">
      {!generatedFlyer ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center bg-slate-50 rounded-md p-4">
          <Wand2 className="w-16 h-16 text-slate-400 mb-4" />
          <h3 className="font-bold text-slate-700">Flyer Preview</h3>
          <p className="text-sm text-slate-500">
            Your generated flyer will appear here.
          </p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col">
          <div
            className="h-40 bg-cover bg-center rounded-t-md"
            style={{ backgroundImage: `url(${selectedListing.image})` }}
          ></div>
          <div className="p-4 flex-grow flex flex-col">
            <h3
              className={`font-bold text-xl text-slate-800 ${
                style === "Classic" ? "font-serif" : "font-sans"
              }`}
            >
              {generatedFlyer.headline}
            </h3>
            <p
              className={`text-sm text-slate-600 mt-2 flex-grow ${
                style === "Minimalist" ? "italic" : ""
              }`}
            >
              {generatedFlyer.body}
            </p>
            <div className="text-center mt-4 border-t pt-3">
              <p className="font-bold text-slate-900">
                {selectedListing.address}
              </p>
              <p className="text-slate-700">{`${selectedListing.beds} Bed | ${selectedListing.baths} Bath | ${selectedListing.sqft} sqft`}</p>
              <p className="text-2xl font-bold text-coral-600 mt-1">
                {selectedListing.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center">
                {generatedFlyer.includesHeadshot && (
                  <img
                    src={currentUser.photo}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full mr-3 object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {currentUser.brokerage}
                  </p>
                </div>
              </div>
              {generatedFlyer.includesQr && (
                <QrCode className="w-12 h-12 text-slate-700" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">
            1. Select Listing
          </h2>
          <select
            value={selectedListingId}
            onChange={(e) => setSelectedListingId(parseInt(e.target.value))}
            className="w-full p-3 border border-slate-300 rounded-md bg-white"
          >
            {userListings.map((l) => (
              <option key={l.id} value={l.id}>
                {l.address}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">
            2. Design with AI
          </h2>
          <label
            className="font-semibold text-slate-700 text-sm"
            htmlFor="prompt"
          >
            Describe the flyer you want
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-md mt-2 mb-4 min-h-[80px] bg-white"
            placeholder="e.g., A clean, minimalist flyer highlighting the new price."
          ></textarea>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-700 text-sm mb-2 flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                Style & Tone
              </h3>
              <div className="flex space-x-2">
                {["Modern", "Classic", "Minimalist"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-4 py-2 text-sm rounded-full transition-colors ${
                      style === s
                        ? "bg-coral-600 text-white"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 text-sm mb-2">
                Include Elements
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeQr}
                    onChange={(e) => setIncludeQr(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-coral-600 focus:ring-coral-500"
                  />
                  <span className="text-slate-700 text-sm flex items-center">
                    <QrCode className="w-4 h-4 mr-2" /> QR Code for Listing Page
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHeadshot}
                    onChange={(e) => setIncludeHeadshot(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-coral-600 focus:ring-coral-500"
                  />
                  <span className="text-slate-700 text-sm flex items-center">
                    <UserCircle className="w-4 h-4 mr-2" /> Agent Headshot &
                    Info
                  </span>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-6 bg-coral-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-coral-700 disabled:bg-slate-400 flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                {" "}
                <Wand2 className="w-5 h-5 mr-2 animate-pulse" /> Generating...
              </>
            ) : (
              <>
                {" "}
                <Wand2 className="w-5 h-5 mr-2" /> Generate Flyer
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">
          3. Preview & Save
        </h2>
        <div className="flex-grow">
          <FlyerPreview />
        </div>
        <button
          onClick={onFlyerSave}
          disabled={!generatedFlyer}
          className="w-full bg-slate-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-800 mt-4 disabled:bg-slate-400"
        >
          Save Flyer
        </button>
      </div>
    </div>
  );
};

const EmailBlastTool = ({ userListings, currentUser, savedFlyers }) => {
  const [selectedListingId, setSelectedListingId] = useState(
    userListings[0]?.id || null
  );
  const [targetingOption, setTargetingOption] = useState("radius");
  const [campaignData, setCampaignData] = useState({ audience: 0, cost: 0 });
  const [isSent, setIsSent] = useState(false);
  const [selectedFlyer, setSelectedFlyer] = useState("none");

  const isAgent = currentUser.role === "agent";
  const selectedListing = userListings.find((l) => l.id === selectedListingId);

  useEffect(() => {
    if (!selectedListing) {
      setCampaignData({ audience: 0, cost: 0 });
      return;
    }
    let audience = 0;
    switch (targetingOption) {
      case "radius":
        audience = 5000;
        break;
      case "metro":
        audience = 150000;
        break;
      case "interested":
        audience = 1250;
        break;
      case "savedSimilar":
        audience = 850;
        break;
      case "viewedListing":
        audience = 247;
        break;
      default:
        audience = 0;
    }
    setCampaignData({ audience, cost: audience * 0.15 });
    setIsSent(false);
  }, [selectedListingId, targetingOption, userListings, selectedListing]);

  const handleSendCampaign = () => setIsSent(true);

  const EmailPreview = () => (
    <div className="border rounded-lg p-4 bg-white flex flex-col h-full">
      <div className="font-bold text-slate-800 mb-2">
        Subject: A New Property You Might Love!
      </div>
      <div className="text-sm text-slate-600 mb-4">
        <p>Hello,</p>
        <p className="mt-2">
          Check out this fantastic new listing. Based on your interests, we
          thought you'd want to see it.
        </p>
      </div>
      <div className="flex-grow border rounded-md p-4 bg-slate-50 text-center flex flex-col justify-center items-center">
        <FileText className="w-12 h-12 text-slate-400 mb-2" />
        <p className="font-semibold text-slate-700">
          {selectedFlyer !== "none" && savedFlyers[selectedListing.id]
            ? `Flyer Attached: "${
                savedFlyers[selectedListing.id].find(
                  (f) => f.name === selectedFlyer
                )?.name
              }"`
            : "No Flyer Attached"}
        </p>
        <p className="text-xs text-slate-500">
          {selectedFlyer === "none" && "Select a saved flyer to attach it."}
        </p>
      </div>
      <div className="border-t pt-2 text-xs text-slate-500 text-center mt-4">
        <p className="font-bold text-slate-700">{currentUser.name}</p>
        <p>{currentUser.brokerage}</p>
        <p>
          {currentUser.phone} | {currentUser.email}
        </p>
        <p>DRE #: {currentUser.dreLicense}</p>
      </div>
    </div>
  );

  const targetingOptions = {
    fsbo: [
      {
        id: "radius",
        icon: MapPin,
        title: "5-Mile Radius",
        desc: "Target potential buyers near the property.",
      },
      {
        id: "metro",
        icon: Globe,
        title: "Entire Metro Area",
        desc: `Reach a broader audience in the ${selectedListing?.metroArea} area.`,
      },
      {
        id: "interested",
        icon: Star,
        title: "Notify Interested Buyers",
        desc: "Send to Equatere users whose searches match.",
      },
    ],
    agent: [
      {
        id: "radius",
        icon: MapPin,
        title: "5-Mile Radius",
        desc: "Target potential buyers near the property.",
      },
      {
        id: "metro",
        icon: Globe,
        title: "Entire Metro Area",
        desc: `Reach a broader audience in the ${selectedListing?.metroArea} area.`,
      },
      {
        id: "savedSimilar",
        icon: Star,
        title: "Buyers Who Saved Similar",
        desc: "Target users who saved properties like this one.",
      },
      {
        id: "viewedListing",
        icon: Eye,
        title: "Buyers Who Viewed Listing",
        desc: "Re-engage users who have already seen this home.",
      },
    ],
  };

  if (!selectedListing) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-slate-800">Email Blast Tool</h2>
        <p className="text-slate-600 mt-4">You have no listings.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">
            1. Select Listing & Flyer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedListingId}
              onChange={(e) => setSelectedListingId(parseInt(e.target.value))}
              className="w-full p-3 border border-slate-300 rounded-md"
            >
              {userListings.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.address}
                </option>
              ))}
            </select>
            <select
              value={selectedFlyer}
              onChange={(e) => setSelectedFlyer(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-md"
            >
              <option value="none">Attach a Saved Flyer...</option>
              {(savedFlyers[selectedListing.id] || []).map((flyer) => (
                <option key={flyer.name} value={flyer.name}>
                  {flyer.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">
            2. Choose Targeting
          </h2>
          <div className="space-y-3">
            {(isAgent ? targetingOptions.agent : targetingOptions.fsbo).map(
              (opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTargetingOption(opt.id)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center ${
                      targetingOption === opt.id
                        ? "border-coral-500 bg-coral-50"
                        : "border-slate-300 hover:border-coral-400"
                    }`}
                  >
                    <Icon className="w-6 h-6 mr-4 text-coral-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{opt.title}</p>
                      <p className="text-sm text-slate-600">{opt.desc}</p>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">
          3. Preview & Send
        </h2>
        <div className="flex-grow">
          <EmailPreview />
        </div>
        <button
          onClick={handleSendCampaign}
          className="w-full bg-coral-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-coral-700 mt-4"
        >
          Send Email Blast
        </button>
      </div>
    </div>
  );
};

const TextBlastTool = ({ userListings, currentUser }) => {
  const [selectedListingId, setSelectedListingId] = useState(
    userListings[0]?.id || null
  );
  const [targetingOption, setTargetingOption] = useState("radius");
  const [campaignData, setCampaignData] = useState({ audience: 0, cost: 0 });
  const [isSent, setIsSent] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("newListing");

  const isAgent = currentUser.role === "agent";
  const selectedListing = userListings.find((l) => l.id === selectedListingId);

  useEffect(() => {
    if (!selectedListing) {
      setCampaignData({ audience: 0, cost: 0 });
      return;
    }
    let audience = 0;
    switch (targetingOption) {
      case "radius":
        audience = 4500;
        break;
      case "metro":
        audience = 120000;
        break;
      case "interested":
        audience = 1100;
        break;
      case "savedSimilar":
        audience = 750;
        break;
      case "viewedListing":
        audience = 210;
        break;
      default:
        audience = 0;
    }
    setCampaignData({ audience, cost: audience * 0.25 });
    setIsSent(false);
  }, [selectedListingId, targetingOption, userListings, selectedListing]);

  const handleSendCampaign = () => setIsSent(true);

  const TextPreview = () => {
    const templates = {
      newListing: `Just Listed! Check out ${selectedListing.address}. View details here: [link]`,
      openHouse: `Open House this weekend for ${selectedListing.address}! Hope to see you there. More info: [link]`,
      priceReduction: `Price drop for ${selectedListing.address}! This is a great opportunity. See the new price: [link]`,
      buyerIncentive: `A new buyer incentive is now offered for ${selectedListing.address}! Learn more: [link]`,
    };
    const message = templates[selectedTemplate];
    return (
      <div className="border rounded-lg p-4 bg-white h-full flex flex-col">
        <div className="bg-slate-200 p-3 rounded-lg">
          <p className="text-sm text-slate-800">{message}</p>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Est. {Math.ceil(message.length / 160)} message segment(s).
        </p>
      </div>
    );
  };

  const targetingOptions = {
    fsbo: [
      {
        id: "radius",
        icon: MapPin,
        title: "5-Mile Radius",
        desc: "Target potential buyers near the property.",
      },
      {
        id: "metro",
        icon: Globe,
        title: "Entire Metro Area",
        desc: `Reach a broader audience in the ${selectedListing?.metroArea} area.`,
      },
      {
        id: "interested",
        icon: Star,
        title: "Notify Interested Buyers",
        desc: "Send to Equatere users whose searches match.",
      },
    ],
    agent: [
      {
        id: "radius",
        icon: MapPin,
        title: "5-Mile Radius",
        desc: "Target potential buyers near the property.",
      },
      {
        id: "metro",
        icon: Globe,
        title: "Entire Metro Area",
        desc: `Reach a broader audience in the ${selectedListing?.metroArea} area.`,
      },
      {
        id: "savedSimilar",
        icon: Star,
        title: "Buyers Who Saved Similar",
        desc: "Target users who saved properties like this one.",
      },
      {
        id: "viewedListing",
        icon: Eye,
        title: "Buyers Who Viewed Listing",
        desc: "Re-engage users who have already seen this home.",
      },
    ],
  };

  if (!selectedListing) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-slate-800">Text Blast Tool</h2>
        <p>You have no listings.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">
            1. Select Listing & Message
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedListingId}
              onChange={(e) => setSelectedListingId(parseInt(e.target.value))}
              className="w-full p-3 border border-slate-300 rounded-md"
            >
              {userListings.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.address}
                </option>
              ))}
            </select>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-md"
            >
              <option value="newListing">New Listing Announcement</option>
              <option value="openHouse">Open House Invitation</option>
              <option value="priceReduction">Price Reduction Alert</option>
              <option value="buyerIncentive">
                Now Offering Buyer Incentive
              </option>
            </select>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">
            2. Choose Targeting
          </h2>
          <div className="space-y-3">
            {(isAgent ? targetingOptions.agent : targetingOptions.fsbo).map(
              (opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTargetingOption(opt.id)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all flex items-center ${
                      targetingOption === opt.id
                        ? "border-coral-500 bg-coral-50"
                        : "border-slate-300 hover:border-coral-400"
                    }`}
                  >
                    <Icon className="w-6 h-6 mr-4 text-coral-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{opt.title}</p>
                      <p className="text-sm text-slate-600">{opt.desc}</p>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-3">
          3. Review & Send
        </h2>
        <div className="flex-grow">
          <TextPreview />
        </div>
        <button
          onClick={handleSendCampaign}
          className="w-full bg-coral-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-coral-700 mt-auto"
        >
          Send Text Blast
        </button>
      </div>
    </div>
  );
};

const SinglePropertyWebsiteTool = ({
  userListings,
  agentInfo,
  showSuccess,
}) => {
  const [selectedListingId, setSelectedListingId] = useState(
    userListings[0]?.id || null
  );
  const [isPublished, setIsPublished] = useState(false);

  const selectedListing = userListings.find((l) => l.id === selectedListingId);

  if (!selectedListing) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold">Single Property Website</h2>
        <p>You have no listings.</p>
      </div>
    );
  }

  const websiteUrl = `https://${selectedListing.address
    .toLowerCase()
    .replace(/[\s,.]+/g, "-")
    .slice(0, -3)}.equatere.homes`;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Single Property Website Generator
      </h2>
      <div className="space-y-4">
        <div>
          <label className="font-semibold text-slate-700">Select Listing</label>
          <select
            value={selectedListingId}
            onChange={(e) => setSelectedListingId(parseInt(e.target.value))}
            className="w-full p-3 border border-slate-300 rounded-md mt-2 bg-white"
          >
            {userListings.map((l) => (
              <option key={l.id} value={l.id}>
                {l.address}
              </option>
            ))}
          </select>
        </div>
        <div className="text-center bg-slate-50 p-4 rounded-lg">
          <p className="text-slate-600">Your website will be published at:</p>
          <p className="font-mono text-coral-600 my-2 break-all">
            {websiteUrl}
          </p>
          <button
            onClick={() => {
              setIsPublished(true);
              showSuccess("Website published successfully!");
            }}
            className="bg-coral-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-coral-700"
          >
            {isPublished ? "Published!" : "Publish Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

const MarketingSuitePage = ({
  currentUser,
  listings,
  users,
  savedFlyers,
  setSavedFlyers,
  showSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("ai-flyer-designer");

  const tabs = [
    { id: "ai-flyer-designer", label: "AI Flyer Designer", icon: Wand2 },
    { id: "email-blast", label: "Email Blast", icon: Mail },
    { id: "text-blast", label: "Text Blast", icon: MessageSquare },
    {
      id: "single-property-website",
      label: "Single Property Website Generator",
      icon: Globe,
    },
  ];

  const handleFlyerSave = () => {
    alert("Flyer saved! It would now be available in the Email Blast tool.");
  };

  const renderContent = () => {
    const userListings = listings.filter((l) => l.agentId === currentUser.id);
    const agentInfo = users.find((u) => u.id === currentUser.id);

    switch (activeTab) {
      case "ai-flyer-designer":
        return (
          <AIFlyerDesigner
            userListings={userListings}
            currentUser={currentUser}
            onFlyerSave={handleFlyerSave}
          />
        );
      case "email-blast":
        return (
          <EmailBlastTool
            userListings={userListings}
            currentUser={currentUser}
            savedFlyers={savedFlyers}
          />
        );
      case "text-blast":
        return (
          <TextBlastTool
            userListings={userListings}
            currentUser={currentUser}
          />
        );
      case "single-property-website":
        return (
          <SinglePropertyWebsiteTool
            userListings={userListings}
            agentInfo={agentInfo}
            showSuccess={showSuccess}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="font-sans bg-slate-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Marketing Suite</h1>
          <p className="text-slate-600 mt-1">
            Powerful tools to promote your listings and reach more buyers.
          </p>
        </div>

        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-coral-600 text-coral-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                  <Icon className="-ml-0.5 mr-2 h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-8">{renderContent()}</div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentUser, setCurrentUser] = useState({
    role: "guest",
    name: "Guest User",
    id: null,
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [documents, setDocuments] = useState([
    {
      id: "doc1",
      name: "Property Inspection Report",
      propertyId: 1,
      agentId: 1,
      url: "/doc/inspection-report-1.pdf",
      access: "secure",
    },
    {
      id: "doc2",
      name: "Seller Disclosures",
      propertyId: 1,
      agentId: 1,
      url: "/doc/seller-disclosures-1.pdf",
      access: "public",
    },
    {
      id: "doc3",
      name: "HOA Documents",
      propertyId: 2,
      agentId: 2,
      url: "/doc/hoa-docs-2.pdf",
      access: "secure",
    },
  ]);
  const [accessRequests, setAccessRequests] = useState([
    { id: "req1", docId: "doc1", userName: "Guest User", status: "pending" },
  ]);
  const [documentActivity, setDocumentActivity] = useState([
    {
      id: "act1",
      propertyId: 1,
      viewer: "John Doe (Agent)",
      action: "Viewed Package",
      timestamp: new Date(Date.now() - 3600 * 1000 * 2),
    },
  ]);

  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPropertyForSharing, setSelectedPropertyForSharing] =
    useState(null);

  const [savedSearches, setSavedSearches] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [savedFlyers, setSavedFlyers] = useState({
    1: [{ name: "Modern Flyer - Final", state: {} }],
    2: [{ name: "Oak Ave - Open House Flyer", state: {} }],
  });

  const [listings, setListings] = useState([
    {
      id: 1,
      title: "Modern Downtown Condo",
      address: "123 Main St, San Francisco, CA",
      price: 1250000,
      beds: 2,
      baths: 2,
      sqft: 1200,
      lotSize: 1500,
      lotUnit: "sqft",
      propertyType: "Residential",
      propertySubType: "Condo",
      location: "San Francisco, CA",
      metroArea: "San Francisco",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop",
      imageUrl:
        "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      agent: "Sarah Johnson",
      agentId: 1,
      offerIncentive: true,
      openHouse: { date: "2025-08-09", time: "2-4 PM" },
      description:
        "Stunning modern condo in the heart of downtown with city views, floor-to-ceiling windows, and state-of-the-art appliances.",
      status: "active",
      views: 247,
      inquiries: 12,
      features: [
        "City Views",
        "Floor-to-ceiling windows",
        "Modern Appliances",
        "24/7 Concierge",
        "Fitness Center",
      ],
      photos: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494203484021-3c454daf695d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop",
      ],
    },
    {
      id: 2,
      title: "Family Home with Pool",
      address: "456 Oak Ave, Oakland, CA",
      price: 925000,
      beds: 4,
      baths: 3,
      sqft: 2800,
      lotSize: 0.25,
      lotUnit: "acres",
      propertyType: "Residential",
      propertySubType: "Single Family",
      location: "Oakland, CA",
      metroArea: "Oakland",
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&auto=format&fit=crop",
      imageUrl:
        "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      agent: "Mike Davis",
      agentId: 2,
      offerIncentive: true,
      openHouse: null,
      description:
        "Beautiful family home with a large pool, spacious backyard, and a newly renovated kitchen. Perfect for summer gatherings.",
      status: "active",
      views: 189,
      inquiries: 8,
      features: ["Pool", "Garage"],
      photos: [
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop",
      ],
    },
    {
      id: 3,
      title: "Charming Craftsman Bungalow",
      address: "789 Pine Ln, Berkeley, CA",
      price: 1150000,
      beds: 3,
      baths: 2,
      sqft: 1800,
      lotSize: 5000,
      lotUnit: "sqft",
      propertyType: "Residential",
      propertySubType: "Single Family",
      location: "Berkeley, CA",
      metroArea: "Berkeley",
      image:
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&auto=format&fit=crop",
      agent: "Jane Smith (FSBO)",
      agentId: 3,
      offerIncentive: false,
      openHouse: null,
      description:
        "Meticulously maintained craftsman home with original details and modern updates. Features a beautiful garden and detached office space.",
      status: "active",
      views: 312,
      inquiries: 15,
      features: [],
      photos: [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop",
      ],
    },
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@equatere.com",
      phone: "(555) 123-4567",
      role: "agent",
      dreLicense: "12345678",
      brokerage: "Prime Real Estate Group",
      photo:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop",
      headshotUrl:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "With over 10 years of experience in the Bay Area market, Sarah is a trusted advisor for both buyers and sellers. Her commitment to client success and deep market knowledge make her a top choice for your real estate needs.",
      services: [
        "Expert Negotiation",
        "Professional Photography",
        "Staging Consultation",
        "Contract Management",
        "Market Analysis",
      ],
      commissionStructure:
        "Flexible commission structures available. Let's discuss what works for you.",
    },
    {
      id: 2,
      name: "Mike Davis",
      email: "mike.davis@email.com",
      phone: "(555) 987-6543",
      role: "agent",
      dreLicense: "87654321",
      brokerage: "Bay Area Realty",
      photo:
        "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&auto=format&fit=crop",
      bio: "Mike specializes in residential properties in the East Bay. He is known for his exceptional negotiation skills and dedication to finding the perfect home for his clients.",
      services: [
        "Buyer Representation",
        "Seller Representation",
        "Investment Properties",
      ],
      commissionStructure: "Typically 2.5% for buyer representation.",
    },
    {
      id: 3,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "(555) 555-5555",
      role: "fsbo",
      photo:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop",
      bio: "Selling my beloved Berkeley home. I've lived here for 20 years and have taken great care of the property. Looking for a buyer who will appreciate its charm as much as I have.",
    },
  ]);

  const [searchFilters, setSearchFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    beds: "",
    baths: "",
    keywords: "",
    propertyType: "",
    propertySubType: "",
    minSqft: "",
    maxSqft: "",
    minLotSize: "",
    maxLotSize: "",
    lotUnit: "sqft",
    features: [],
    openHouseOnly: false,
  });

  const showSuccess = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const generateId = () => Date.now() + Math.random();

  const mockAnalyticsData = [
    { metro: "San Francisco", avgIncentive: 2.8, daysOnMarket: 18 },
    { metro: "Oakland", avgIncentive: 2.3, daysOnMarket: 25 },
    { metro: "San Jose", avgIncentive: 3.1, daysOnMarket: 22 },
    { metro: "Berkeley", avgIncentive: 2.6, daysOnMarket: 20 },
  ];

  // Functions to handle saving items
  const handleSaveSearch = () => {
    if (currentUser.role === "guest") {
      showSuccess("Please log in to save searches.");
      return;
    }
    const newSearch = {
      id: generateId(),
      filters: { ...searchFilters },
      name: `Search in ${searchFilters.location || "Anywhere"}`,
    };
    setSavedSearches((prev) => [...prev, newSearch]);
    showSuccess("Search saved successfully!");
  };

  const handleSaveProperty = (propertyId) => {
    if (currentUser.role === "guest") {
      showSuccess("Please log in to save properties.");
      return;
    }
    if (savedProperties.includes(propertyId)) {
      setSavedProperties((prev) => prev.filter((id) => id !== propertyId));
      showSuccess("Property removed from saved items.");
    } else {
      setSavedProperties((prev) => [...prev, propertyId]);
      showSuccess("Property saved successfully!");
    }
  };

  // Navigation Component
  const Navigation = () => (
    <div>
      {/* Demo Bar */}
      <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap">
          <div className="flex items-center space-x-2 md:space-x-4 mb-2 md:mb-0">
            <span className="text-sm font-medium text-yellow-800">
              🚀 Demo Mode:
            </span>
            <button
              onClick={() => {
                setCurrentUser({ role: "guest", name: "Guest User", id: null });
                setCurrentPage("home");
              }}
              className={`px-3 py-1 rounded text-sm ${
                currentUser.role === "guest"
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-yellow-800 hover:bg-yellow-50"
              }`}
            >
              Guest
            </button>
            <button
              onClick={() => {
                setCurrentUser(users.find((u) => u.role === "agent"));
                setCurrentPage("dashboard");
                setActiveTab("overview");
              }}
              className={`px-3 py-1 rounded text-sm ${
                currentUser.role === "agent"
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-yellow-800 hover:bg-yellow-50"
              }`}
            >
              Agent
            </button>
            <button
              onClick={() => {
                setCurrentUser({ ...users.find((u) => u.role === "fsbo") });
                setCurrentPage("dashboard");
                setActiveTab("overview");
              }}
              className={`px-3 py-1 rounded text-sm ${
                currentUser.role === "fsbo"
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-yellow-800 hover:bg-yellow-50"
              }`}
            >
              FSBO Seller
            </button>
            <button
              onClick={() => {
                setCurrentUser({ role: "admin", name: "Admin User", id: 999 });
                setCurrentPage("dashboard");
                setActiveTab("overview");
              }}
              className={`px-3 py-1 rounded text-sm ${
                currentUser.role === "admin"
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-yellow-800 hover:bg-yellow-50"
              }`}
            >
              Admin
            </button>
          </div>
          <div className="text-sm text-yellow-700">
            Current: <span className="font-semibold">{currentUser.name}</span> (
            {currentUser.role})
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage("home")}
            className="hover:opacity-80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="144" height="32">
              <style>
                {`.equatere-logo-nav { font-family: 'Train One', cursive; font-size: 1.6rem; fill: #ea580c; }`}
                {`.equatere-logo-nav-alt { fill: #d1d5db; }`}
              </style>
              <text x="0" y="25" className="equatere-logo-nav">
                EQUATE<tspan className="equatere-logo-nav-alt">R</tspan>
                <tspan className="equatere-logo-nav-alt">E</tspan>
              </text>
            </svg>
          </button>
          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => setCurrentPage("home")}
              className="hover:text-coral-400"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage("search")}
              className="hover:text-coral-400"
            >
              Search
            </button>
            <button
              onClick={() => setCurrentPage("landing")}
              className="hover:text-coral-400"
            >
              About
            </button>
            <button
              onClick={() => setCurrentPage("pricing")}
              className="hover:text-coral-400"
            >
              Pricing
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {currentUser.role === "guest" ? (
            <div className="space-x-2">
              <button
                onClick={() => setCurrentPage("login")}
                className="bg-coral-600 px-4 py-2 rounded hover:bg-coral-700"
              >
                Login
              </button>
              <button
                onClick={() => setCurrentPage("register")}
                className="bg-slate-700 px-4 py-2 rounded hover:bg-slate-600"
              >
                Register
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">
                Welcome, {currentUser.name}
              </span>
              <button
                onClick={() => setCurrentPage("dashboard")}
                className="bg-coral-600 px-4 py-2 rounded hover:bg-coral-700"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setCurrentUser({
                    role: "guest",
                    name: "Guest User",
                    id: null,
                  });
                  setCurrentPage("home");
                }}
                className="text-slate-300 hover:text-white"
              >
                Logout
              </button>
            </div>
          )}
          <button
            onClick={() => {
              setSelectedProperty(listings.find((l) => l.id === 1));
              setCurrentPage("document-package");
            }}
            className="text-xs text-slate-400 hover:text-slate-300 hidden lg:block"
          >
            [Dev: Doc Package]
          </button>
        </div>
      </nav>
    </div>
  );

  // Notification Component
  const Notification = () => {
    if (!showNotification) return null;

    return (
      <div className="fixed top-24 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center animate-fade-in-down">
        <Check className="w-5 h-5 mr-2" />
        {notificationMessage}
      </div>
    );
  };

  // Homepage
  const Homepage = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto max-w-lg mx-auto mb-6"
            viewBox="0 0 295 72"
          >
            <style>
              {`.equatere-logo-hero { font-family: 'Train One', cursive; font-size: 3rem; letter-spacing: 2px; fill: #ea580c; }`}
              {`.equatere-logo-hero-alt { fill: #d1d5db; }`}
            </style>
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="equatere-logo-hero"
            >
              EQUATE<tspan className="equatere-logo-hero-alt">R</tspan>
              <tspan className="equatere-logo-hero-alt">E</tspan>
            </text>
          </svg>
          <p className="text-lg md:text-xl mb-8 text-slate-300">
            leveling the real estate playing field
          </p>

          <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Enter an address, city, or zip code"
                className="p-3 border rounded text-slate-900 md:col-span-2"
                value={searchFilters.location}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    location: e.target.value,
                  })
                }
              />
              <select
                className="p-3 border rounded text-slate-900"
                value={searchFilters.propertyType}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    propertyType: e.target.value,
                  })
                }
              >
                <option value="">Any Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
              <input
                type="number"
                placeholder="Max Price"
                className="p-3 border rounded text-slate-900"
                value={searchFilters.maxPrice}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    maxPrice: e.target.value,
                  })
                }
              />
              <button
                onClick={() => setCurrentPage("search")}
                className="bg-coral-600 text-white p-3 rounded hover:bg-coral-700 flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-coral-600">
                {listings.length}
              </div>
              <div className="text-slate-600">Total Listings</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-coral-600">
                {users.length}
              </div>
              <div className="text-slate-600">Active Members</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-coral-600">$837K</div>
              <div className="text-slate-600">Average Home Price</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl font-bold text-coral-600">18</div>
              <div className="text-slate-600">Average Days on Market</div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            Featured Listings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  {listing.offerIncentive && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                      Buyer Incentive Available
                    </div>
                  )}
                  <button
                    onClick={() => handleSaveProperty(listing.id)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75"
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        savedProperties.includes(listing.id)
                          ? "fill-current text-coral-500"
                          : ""
                      }`}
                    />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {listing.address}
                  </h3>
                  <p className="text-2xl font-bold text-coral-600 mb-2">
                    ${listing.price.toLocaleString()}
                  </p>
                  <div className="flex items-center text-slate-600 mb-2 flex-wrap">
                    <Bed className="w-4 h-4 mr-1" />
                    <span className="mr-4">{listing.beds} beds</span>
                    <Bath className="w-4 h-4 mr-1" />
                    <span className="mr-4">{listing.baths} baths</span>
                    <Square className="w-4 h-4 mr-1" />
                    <span>{listing.sqft} sqft</span>
                  </div>
                  <p className="text-slate-600 mb-4">{listing.location}</p>
                  <button
                    onClick={() => {
                      setSelectedProperty(listing);
                      setCurrentImageIndex(0);
                      setCurrentPage("property-details");
                    }}
                    className="w-full bg-coral-600 text-white py-2 rounded hover:bg-coral-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-300">
            <Shield className="w-5 h-5 inline mr-2" />
            All real estate commission rates are negotiable. Equatere does not
            recommend or require commissions be offered. Buyer incentives shown
            are voluntary offerings by property sellers, and are not required to
            advertise on this platform.
          </p>
        </div>
      </div>
    </div>
  );

  const DashboardSidebar = ({ onTabClick, activeTab, currentUser }) => {
    const getSidebarItems = () => {
      switch (currentUser.role) {
        case "admin":
          return [
            { id: "overview", label: "Admin Overview", icon: Home },
            { id: "users", label: "User Management", icon: Users },
            {
              id: "platform-analytics",
              label: "Platform Analytics",
              icon: BarChart3,
            },
            { id: "settings", label: "Settings", icon: Settings },
          ];
        case "fsbo":
          return [
            { id: "overview", label: "Overview", icon: Home },
            { id: "listings", label: "My Listing", icon: Building },
            { id: "create-listing", label: "Create Listing", icon: Plus },
            { id: "documents", label: "Document Vault", icon: FileText },
            { id: "saved", label: "Saved Items", icon: Bookmark },
            { id: "marketing", label: "Marketing Suite", icon: Mail },
          ];
        case "agent":
        default:
          return [
            { id: "overview", label: "Overview", icon: Home },
            { id: "listings", label: "My Listings", icon: Building },
            { id: "create-listing", label: "Create Listing", icon: Plus },
            { id: "profile", label: "My Profile", icon: User },
            { id: "documents", label: "Document Vault", icon: FileText },
            { id: "saved", label: "Saved Items", icon: Bookmark },
            { id: "marketing", label: "Marketing Suite", icon: Mail },
            {
              id: "analytics",
              label: "Buyer Incentives Analytics",
              icon: BarChart3,
            },
          ];
      }
    };

    const sidebarItems = getSidebarItems();

    return (
      <div className="w-64 bg-slate-900 text-white min-h-screen p-4 hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold">
            {currentUser.role === "admin" && "Admin Dashboard"}
            {currentUser.role === "agent" && "Agent Dashboard"}
            {currentUser.role === "fsbo" && "Seller Dashboard"}
          </h2>
          <p className="text-slate-400">{currentUser.name}</p>
        </div>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id ? "bg-coral-600" : "hover:bg-slate-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    const handleTabClick = (tabId) => {
      if (tabId === "profile") {
        setSelectedAgentId(currentUser.id);
        setCurrentPage("agent-profile");
      } else {
        setActiveTab(tabId);
        setCurrentPage("dashboard");
      }
    };

    const AdminOverviewTab = () => (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-coral-600">
                  {users.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-coral-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Listings</p>
                <p className="text-3xl font-bold text-coral-600">
                  {listings.length}
                </p>
              </div>
              <Building className="w-8 h-8 text-coral-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Platform Revenue</p>
                <p className="text-3xl font-bold text-coral-600">$12.4K</p>
              </div>
              <DollarSign className="w-8 h-8 text-coral-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Agents</p>
                <p className="text-3xl font-bold text-coral-600">
                  {users.filter((u) => u.role === "agent").length}
                </p>
              </div>
              <User className="w-8 h-8 text-coral-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">
                  New agent registration: Mike Davis
                </p>
                <p className="text-sm text-slate-600">2 hours ago</p>
              </div>
              <span className="text-green-600 font-medium">+1 User</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">
                  New listing created: Family Home with Pool
                </p>
                <p className="text-sm text-slate-600">1 day ago</p>
              </div>
              <span className="text-blue-600 font-medium">+1 Listing</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">
                  Platform revenue milestone reached
                </p>
                <p className="text-sm text-slate-600">3 days ago</p>
              </div>
              <span className="text-coral-600 font-medium">$10K+</span>
            </div>
          </div>
        </div>
      </div>
    );

    const UsersTab = () => (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
          <button className="bg-coral-600 text-white px-4 py-2 rounded hover:bg-coral-700">
            Add New User
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">
                  User
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">
                  Listings
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {listings.filter((l) => l.agentId === user.id).length}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-coral-600 hover:text-coral-700">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-slate-600 hover:text-slate-700">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    const OverviewTab = () => (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Listings</p>
                <p className="text-3xl font-bold text-coral-600">
                  {listings.filter((l) => l.agentId === currentUser.id).length}
                </p>
              </div>
              <Building className="w-8 h-8 text-coral-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Views</p>
                <p className="text-3xl font-bold text-coral-600">1,247</p>
              </div>
              <Eye className="w-8 h-8 text-coral-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Inquiries</p>
                <p className="text-3xl font-bold text-coral-600">38</p>
              </div>
              <Mail className="w-8 h-8 text-coral-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Days on Market</p>
                <p className="text-3xl font-bold text-coral-600">18</p>
              </div>
              <Clock className="w-8 h-8 text-coral-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">
                  New inquiry on Modern Downtown Condo
                </p>
                <p className="text-sm text-slate-600">2 hours ago</p>
              </div>
              <button className="bg-coral-600 text-white px-4 py-2 rounded hover:bg-coral-700">
                Respond
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium">Document access requested</p>
                <p className="text-sm text-slate-600">1 day ago</p>
              </div>
              <button className="bg-slate-200 text-slate-700 px-4 py-2 rounded hover:bg-slate-300">
                Review
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Listing views increased 15%</p>
                <p className="text-sm text-slate-600">3 days ago</p>
              </div>
              <span className="text-green-600 font-medium">+15%</span>
            </div>
          </div>
        </div>
      </div>
    );

    const ListingsTab = () => (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.filter((l) => l.agentId === currentUser.id).length > 0 ? (
            listings
              .filter((l) => l.agentId === currentUser.id)
              .map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-32 object-cover rounded mb-4"
                  />
                  <h3 className="font-semibold mb-2">{listing.address}</h3>
                  <p className="text-coral-600 font-bold">
                    ${listing.price.toLocaleString()}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button className="text-coral-600 hover:text-coral-700">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-slate-600 hover:text-slate-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <p className="text-slate-600">You have no active listings.</p>
              <button
                onClick={() => setActiveTab("create-listing")}
                className="mt-4 bg-coral-600 text-white px-4 py-2 rounded hover:bg-coral-700"
              >
                Create a Listing
              </button>
            </div>
          )}
        </div>
      </div>
    );

    const CreateListingTab = ({
      currentUser,
      setListings,
      showSuccess,
      setActiveTab,
    }) => {
      const initialFormState = {
        title: "",
        address: "",
        price: "",
        beds: "",
        baths: "",
        sqft: "",
        location: "",
        description: "",
        propertyType: "Residential",
        propertySubType: "Single Family",
        lotSize: "",
        lotUnit: "sqft",
        openHouseDate: "",
        openHouseStartTime: "",
        openHouseEndTime: "",
        offerIncentive: false,
        incentiveType: "percentage",
        incentiveValue: "",
        photos: [],
        features: [],
      };
      const [newListing, setNewListing] = useState(initialFormState);
      const [formErrors, setFormErrors] = useState({});
      const [photoUrl, setPhotoUrl] = useState("");

      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewListing((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      };

      const handleFeatureChange = (e) => {
        const { value, checked } = e.target;
        setNewListing((prev) => {
          const features = checked
            ? [...prev.features, value]
            : prev.features.filter((f) => f !== value);
          return { ...prev, features };
        });
      };

      const handleAddPhoto = () => {
        if (photoUrl && newListing.photos.length < 25) {
          setNewListing((prev) => ({
            ...prev,
            photos: [...prev.photos, photoUrl],
          }));
          setPhotoUrl("");
        } else if (newListing.photos.length >= 25) {
          showSuccess("You have reached the 25 photo limit.");
        }
      };

      const handleRemovePhoto = (indexToRemove) => {
        setNewListing((prev) => ({
          ...prev,
          photos: prev.photos.filter((_, index) => index !== indexToRemove),
        }));
      };

      const validateForm = () => {
        const errors = {};
        if (!newListing.address) errors.address = "Address is required.";
        if (!newListing.price) errors.price = "Price is required.";
        if (!newListing.description)
          errors.description = "Description is required.";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
          showSuccess("Please fill out all required fields.");
          return;
        }

        const newListingData = {
          id: generateId(),
          ...newListing,
          title: newListing.address,
          price: parseInt(newListing.price),
          beds: parseInt(newListing.beds) || 0,
          baths: parseInt(newListing.baths) || 0,
          sqft: parseInt(newListing.sqft) || 0,
          agent: currentUser.name,
          agentId: currentUser.id,
          image:
            newListing.photos.length > 0
              ? newListing.photos[0]
              : "https://placehold.co/400x400/cccccc/666666?text=New+Listing",
          photos:
            newListing.photos.length > 0
              ? newListing.photos
              : ["https://placehold.co/400x400/cccccc/666666?text=New+Listing"],
          offerIncentive: newListing.offerIncentive,
          incentive: newListing.offerIncentive
            ? {
                type: newListing.incentiveType,
                value: newListing.incentiveValue,
              }
            : null,
          openHouse: newListing.openHouseDate
            ? `${newListing.openHouseDate} ${newListing.openHouseStartTime}-${newListing.openHouseEndTime}`
            : null,
        };

        setListings((prev) => [newListingData, ...prev]);
        showSuccess("Listing created successfully!");
        setNewListing(initialFormState);
        setActiveTab("listings");
      };

      const propertySubTypes = {
        Residential: ["Single Family", "Condo", "Townhouse", "Multi-Family"],
        Commercial: ["Office", "Retail", "Industrial", "Land"],
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4">
              Create New Listing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Property Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={newListing.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                />
                {formErrors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={newListing.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                />
                {formErrors.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.price}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Property Type
                  </label>
                  <select
                    name="propertyType"
                    value={newListing.propertyType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                  >
                    <option>Residential</option>
                    <option>Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Sub-Type
                  </label>
                  <select
                    name="propertySubType"
                    value={newListing.propertySubType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                  >
                    {propertySubTypes[newListing.propertyType].map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Beds
                    </label>
                    <input
                      type="number"
                      name="beds"
                      value={newListing.beds}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Baths
                    </label>
                    <input
                      type="number"
                      name="baths"
                      value={newListing.baths}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Sq. Ft.
                    </label>
                    <input
                      type="number"
                      name="sqft"
                      value={newListing.sqft}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Lot
                    </label>
                    <input
                      type="number"
                      name="lotSize"
                      value={newListing.lotSize}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Unit
                    </label>
                    <select
                      name="lotUnit"
                      value={newListing.lotUnit}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                    >
                      <option value="sqft">Sq Ft</option>
                      <option value="acres">Acres</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={newListing.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                ></textarea>
                {formErrors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              Property Photos
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Paste image URL here"
                className="flex-grow p-2 border border-slate-300 rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-600"
              >
                Add Photo
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              {newListing.photos.length} / 25 photos added
            </p>
            <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-4">
              {newListing.photos.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              Open House
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Date
                </label>
                <input
                  type="date"
                  name="openHouseDate"
                  value={newListing.openHouseDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Start Time
                </label>
                <input
                  type="time"
                  name="openHouseStartTime"
                  value={newListing.openHouseStartTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  End Time
                </label>
                <input
                  type="time"
                  name="openHouseEndTime"
                  value={newListing.openHouseEndTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              Buyer Incentives
            </h3>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="offerIncentiveToggle"
                className="text-sm font-medium text-slate-700"
              >
                Offer Buyer Incentives?
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="offerIncentiveToggle"
                  name="offerIncentive"
                  checked={newListing.offerIncentive}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-coral-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-600"></div>
              </label>
            </div>
            {newListing.offerIncentive && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Incentive Type
                  </label>
                  <select
                    name="incentiveType"
                    value={newListing.incentiveType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="dollar">Set Dollar Amount</option>
                    <option value="call">Call Agent</option>
                  </select>
                </div>
                {(newListing.incentiveType === "percentage" ||
                  newListing.incentiveType === "dollar") && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      {newListing.incentiveType === "percentage"
                        ? "Percentage (%)"
                        : "Amount ($)"}
                    </label>
                    <input
                      type="number"
                      name="incentiveValue"
                      value={newListing.incentiveValue}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-slate-200 text-slate-700 px-6 py-2 rounded-md hover:bg-slate-300"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="bg-coral-600 text-white px-6 py-2 rounded-md hover:bg-coral-700"
            >
              Publish Listing
            </button>
          </div>
        </form>
      );
    };

    const AnalyticsTab = () => (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Buyer Incentives Analytics</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Average Buyer Incentives by Metro Area
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockAnalyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metro" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, "Avg Incentive"]} />
              <Legend />
              <Bar
                dataKey="avgIncentive"
                name="Avg. Incentive (%)"
                fill="#ea580c"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );

    const DocumentVaultTab = () => {
      const agentListings = listings.filter(
        (l) => l.agentId === currentUser.id
      );
      const [expandedListing, setExpandedListing] = useState(
        agentListings.length > 0 ? agentListings[0].id : null
      );

      const handleShareClick = (property) => {
        setSelectedPropertyForSharing(property);
        setShowShareModal(true);
      };

      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Document Vault</h1>
            <button className="bg-coral-600 text-white px-4 py-2 rounded hover:bg-coral-700 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </button>
          </div>

          <div className="space-y-4">
            {agentListings.map((listing) => {
              const listingDocs = documents.filter(
                (d) => d.propertyId === listing.id
              );
              const activities = documentActivity.filter(
                (a) => a.propertyId === listing.id
              );
              const isExpanded = expandedListing === listing.id;

              return (
                <div key={listing.id} className="bg-white rounded-lg shadow">
                  <button
                    onClick={() =>
                      setExpandedListing(isExpanded ? null : listing.id)
                    }
                    className="w-full p-4 text-left flex justify-between items-center"
                  >
                    <h2 className="text-xl font-semibold">{listing.address}</h2>
                    <ChevronRight
                      className={`transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="p-6 border-t">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Documents in Package ({listingDocs.length})
                          </h3>
                          <div className="space-y-3">
                            {listingDocs.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-md"
                              >
                                <div className="flex items-center">
                                  <FileText
                                    size={16}
                                    className="mr-2 text-slate-500"
                                  />
                                  <span>{doc.name}</span>
                                </div>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    doc.access === "secure"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {doc.access}
                                </span>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => handleShareClick(listing)}
                            className="mt-4 w-full bg-coral-600 text-white px-4 py-2 rounded hover:bg-coral-700 flex items-center justify-center"
                          >
                            <Share2 size={16} className="mr-2" />
                            Share Package
                          </button>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            Activity Log
                          </h3>
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {activities.map((act) => (
                              <div
                                key={act.id}
                                className="flex items-start p-3 bg-slate-50 rounded-md"
                              >
                                <Activity
                                  size={16}
                                  className="mr-3 mt-1 text-slate-500"
                                />
                                <div>
                                  <p className="font-medium">
                                    {act.viewer}{" "}
                                    <span className="font-normal text-slate-600">
                                      {act.action}
                                    </span>
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {act.timestamp.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {activities.length === 0 && (
                              <p className="text-slate-500">No activity yet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const SavedItemsTab = () => (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Saved Properties ({savedProperties.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.length > 0 ? (
              listings
                .filter((l) => savedProperties.includes(l.id))
                .map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white rounded-lg shadow p-4"
                  >
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                    <h3 className="font-semibold mb-2">{listing.address}</h3>
                    <p className="text-coral-600 font-bold">
                      ${listing.price.toLocaleString()}
                    </p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => {
                          setSelectedProperty(listing);
                          setCurrentPage("property-details");
                        }}
                        className="text-coral-600 hover:text-coral-700"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSaveProperty(listing.id)}
                        className="text-slate-600 hover:text-slate-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg">
                <p className="text-slate-600">You have no saved properties.</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Saved Searches ({savedSearches.length})
          </h2>
          <div className="space-y-4">
            {savedSearches.length > 0 ? (
              savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{search.name}</p>
                    <p className="text-sm text-slate-500">
                      {Object.values(search.filters)
                        .filter((v) => v)
                        .join(", ")}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSearchFilters(search.filters);
                        setCurrentPage("search");
                      }}
                      className="bg-coral-600 text-white px-4 py-2 rounded hover:bg-coral-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        setSavedSearches((prev) =>
                          prev.filter((s) => s.id !== search.id)
                        )
                      }
                      className="bg-slate-200 text-slate-700 px-4 py-2 rounded hover:bg-slate-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-lg">
                <p className="text-slate-600">You have no saved searches.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    return (
      <div className="flex">
        <DashboardSidebar
          onTabClick={handleTabClick}
          activeTab={activeTab}
          currentUser={currentUser}
        />
        <div className="flex-1 p-4 md:p-8 bg-slate-50 min-h-screen">
          {activeTab === "overview" &&
            (currentUser.role === "admin" ? (
              <AdminOverviewTab />
            ) : (
              <OverviewTab />
            ))}
          {activeTab === "users" && <UsersTab />}
          {activeTab === "listings" && <ListingsTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "create-listing" && (
            <CreateListingTab
              currentUser={currentUser}
              setListings={setListings}
              showSuccess={showSuccess}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "documents" && <DocumentVaultTab />}
          {activeTab === "saved" && <SavedItemsTab />}
          {activeTab === "marketing" && (
            <MarketingSuitePage
              currentUser={currentUser}
              listings={listings}
              users={users}
              savedFlyers={savedFlyers}
              setSavedFlyers={setSavedFlyers}
              showSuccess={showSuccess}
            />
          )}
          {activeTab === "platform-analytics" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-6">Platform Analytics</h1>
              <p className="text-slate-600">
                Platform-wide analytics would go here...
              </p>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-6">Settings</h1>
              <p className="text-slate-600">
                Platform settings would go here...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Search Page
  const SearchPage = () => {
    const handleFeatureChange = (e) => {
      const { value, checked } = e.target;
      setSearchFilters((prev) => {
        const features = checked
          ? [...prev.features, value]
          : prev.features.filter((f) => f !== value);
        return { ...prev, features };
      });
    };

    const filteredListings = listings.filter((listing) => {
      if (
        searchFilters.location &&
        !listing.location
          .toLowerCase()
          .includes(searchFilters.location.toLowerCase()) &&
        !listing.address
          .toLowerCase()
          .includes(searchFilters.location.toLowerCase())
      )
        return false;
      if (
        searchFilters.minPrice &&
        listing.price < parseInt(searchFilters.minPrice)
      )
        return false;
      if (
        searchFilters.maxPrice &&
        listing.price > parseInt(searchFilters.maxPrice)
      )
        return false;
      if (searchFilters.beds && listing.beds < parseInt(searchFilters.beds))
        return false;
      if (
        searchFilters.propertyType &&
        listing.propertyType !== searchFilters.propertyType
      )
        return false;
      if (
        searchFilters.propertySubType &&
        listing.propertySubType !== searchFilters.propertySubType
      )
        return false;
      if (
        searchFilters.minSqft &&
        listing.sqft < parseInt(searchFilters.minSqft)
      )
        return false;
      if (
        searchFilters.maxSqft &&
        listing.sqft > parseInt(searchFilters.maxSqft)
      )
        return false;

      if (searchFilters.minLotSize || searchFilters.maxLotSize) {
        const lotSizeInSqft =
          listing.lotUnit === "acres"
            ? listing.lotSize * 43560
            : listing.lotSize;
        const searchMin =
          searchFilters.lotUnit === "acres"
            ? (searchFilters.minLotSize || 0) * 43560
            : searchFilters.minLotSize || 0;
        const searchMax =
          searchFilters.lotUnit === "acres"
            ? (searchFilters.maxLotSize || Infinity) * 43560
            : searchFilters.maxLotSize || Infinity;
        if (lotSizeInSqft < searchMin || lotSizeInSqft > searchMax)
          return false;
      }

      if (
        searchFilters.features.length > 0 &&
        !searchFilters.features.every((feat) => listing.features.includes(feat))
      )
        return false;
      if (searchFilters.openHouseOnly && !listing.openHouse) return false;
      return true;
    });

    const propertySubTypes = {
      Residential: ["Single Family", "Condo", "Townhouse", "Multi-Family"],
      Commercial: ["Office", "Retail", "Industrial", "Land"],
    };

    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Property Search</h1>
            <button
              onClick={handleSaveSearch}
              className="bg-coral-600 text-white px-4 py-2 rounded hover:bg-coral-700 flex items-center"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Save Search
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter an address, city, or zip code"
                  className="mt-1 p-2 w-full border rounded-md"
                  value={searchFilters.location}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      location: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="No Min"
                    className="mt-1 p-2 w-full border rounded-md"
                    value={searchFilters.minPrice}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        minPrice: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="No Max"
                    className="mt-1 p-2 w-full border rounded-md"
                    value={searchFilters.maxPrice}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        maxPrice: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Min Sqft
                  </label>
                  <input
                    type="number"
                    placeholder="No Min"
                    className="mt-1 p-2 w-full border rounded-md"
                    value={searchFilters.minSqft}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        minSqft: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Max Sqft
                  </label>
                  <input
                    type="number"
                    placeholder="No Max"
                    className="mt-1 p-2 w-full border rounded-md"
                    value={searchFilters.maxSqft}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        maxSqft: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Property Type
                  </label>
                  <select
                    className="mt-1 p-2 w-full border rounded-md"
                    value={searchFilters.propertyType}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        propertyType: e.target.value,
                        propertySubType: "",
                      })
                    }
                  >
                    <option value="">Any Type</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Sub-Type
                  </label>
                  <select
                    className="mt-1 p-2 w-full border rounded-md"
                    disabled={!searchFilters.propertyType}
                    value={searchFilters.propertySubType}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        propertySubType: e.target.value,
                      })
                    }
                  >
                    <option value="">Any Sub-Type</option>
                    {searchFilters.propertyType &&
                      propertySubTypes[searchFilters.propertyType].map(
                        (type) => <option key={type}>{type}</option>
                      )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Beds
                  </label>
                  <select
                    className="mt-1 p-2 w-full border rounded-md"
                    value={searchFilters.beds}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        beds: e.target.value,
                      })
                    }
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Baths
                  </label>
                  <select
                    className="mt-1 p-2 w-full border rounded-md"
                    value={searchFilters.baths}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        baths: e.target.value,
                      })
                    }
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-4 border-t pt-4">
                <label className="block text-sm font-medium text-slate-700">
                  Lot Size
                </label>
                <div className="grid grid-cols-3 gap-4 mt-1">
                  <input
                    type="number"
                    placeholder="Min"
                    className="p-2 w-full border rounded-md"
                    value={searchFilters.minLotSize}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        minLotSize: e.target.value,
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="p-2 w-full border rounded-md"
                    value={searchFilters.maxLotSize}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        maxLotSize: e.target.value,
                      })
                    }
                  />
                  <select
                    className="p-2 w-full border rounded-md"
                    value={searchFilters.lotUnit}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        lotUnit: e.target.value,
                      })
                    }
                  >
                    <option value="sqft">Sq Ft</option>
                    <option value="acres">Acres</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Features
                </label>
                <div className="flex flex-wrap gap-4">
                  {["Pool", "Garage", "Air Conditioning", "Garden"].map(
                    (feature) => (
                      <label
                        key={feature}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          value={feature}
                          checked={searchFilters.features.includes(feature)}
                          onChange={handleFeatureChange}
                          className="rounded"
                        />
                        <span>{feature}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="md:col-span-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="openHouseToggle"
                    className="text-sm font-medium text-slate-700"
                  >
                    Open House Only
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="openHouseToggle"
                      checked={searchFilters.openHouseOnly}
                      onChange={(e) =>
                        setSearchFilters({
                          ...searchFilters,
                          openHouseOnly: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-coral-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-600"></div>
                  </label>
                </div>
                <button
                  onClick={() =>
                    setSearchFilters({
                      location: "",
                      minPrice: "",
                      maxPrice: "",
                      beds: "",
                      baths: "",
                      keywords: "",
                      propertyType: "",
                      propertySubType: "",
                      minSqft: "",
                      maxSqft: "",
                      features: [],
                      openHouseOnly: false,
                      minLotSize: "",
                      maxLotSize: "",
                      lotUnit: "sqft",
                    })
                  }
                  className="bg-slate-200 text-slate-700 px-6 py-2 rounded hover:bg-slate-300"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-lg shadow p-4 md:p-6 flex flex-col md:flex-row"
                >
                  <div className="relative w-full md:w-48 h-48 md:h-32 mr-6 mb-4 md:mb-0 flex-shrink-0">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover rounded"
                    />
                    {listing.offerIncentive && (
                      <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        Buyer Incentive Available
                      </div>
                    )}
                    <button
                      onClick={() => handleSaveProperty(listing.id)}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75"
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          savedProperties.includes(listing.id)
                            ? "fill-current text-coral-500"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {listing.address}
                    </h3>
                    <p className="text-2xl font-bold text-coral-600 mb-2">
                      ${listing.price.toLocaleString()}
                    </p>
                    <div className="flex items-center text-slate-600 mb-2 flex-wrap">
                      <Bed className="w-4 h-4 mr-1" />
                      <span className="mr-4">{listing.beds} beds</span>
                      <Bath className="w-4 h-4 mr-1" />
                      <span className="mr-4">{listing.baths} baths</span>
                      <Square className="w-4 h-4 mr-1" />
                      <span className="mr-4">{listing.sqft} sqft</span>
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{listing.location}</span>
                    </div>
                    <p className="text-slate-600 mb-4">{listing.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-500">
                        Agent: {listing.agent}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProperty(listing);
                          setCurrentImageIndex(0);
                          setCurrentPage("property-details");
                        }}
                        className="bg-coral-600 text-white px-4 py-2 rounded hover:bg-coral-700"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-slate-600 text-lg">
                  No listings match your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Mortgage Calculator Component
  const MortgageCalculator = ({ price }) => {
    const [loanAmount, setLoanAmount] = useState(price * 0.8);
    const [downPayment, setDownPayment] = useState(price * 0.2);
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(30);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
      const principal = loanAmount;
      const monthlyInterestRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;

      if (principal > 0 && monthlyInterestRate > 0) {
        const payment =
          (principal *
            (monthlyInterestRate *
              Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
          (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        setMonthlyPayment(payment);
      } else {
        setMonthlyPayment(0);
      }
    }, [loanAmount, interestRate, loanTerm]);

    useEffect(() => {
      setLoanAmount(price - downPayment);
    }, [price, downPayment]);

    const handleDownPaymentChange = (e) => {
      const value = parseFloat(e.target.value) || 0;
      setDownPayment(value);
    };

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4 border-b pb-4">
          Mortgage Calculator
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Home Price
            </label>
            <input
              type="text"
              readOnly
              value={`$${price.toLocaleString()}`}
              className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Down Payment ($)
            </label>
            <input
              type="number"
              value={downPayment}
              onChange={handleDownPaymentChange}
              className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Loan Amount
            </label>
            <input
              type="text"
              readOnly
              value={`$${loanAmount.toLocaleString()}`}
              className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Loan Term (Years)
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(parseInt(e.target.value))}
              className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
            >
              <option value="30">30 Years</option>
              <option value="20">20 Years</option>
              <option value="15">15 Years</option>
              <option value="10">10 Years</option>
            </select>
          </div>
          <div className="text-center pt-4 border-t">
            <p className="text-slate-600">Estimated Monthly Payment</p>
            <p className="text-3xl font-bold text-coral-600">
              $
              {monthlyPayment.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Does not include taxes, insurance, or HOA fees.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Property Details
  const PropertyDetails = () => {
    // FIX: Add a guard clause to prevent crashing if no property is selected.
    if (!selectedProperty) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h1 className="text-2xl font-bold mb-4">No Property Selected</h1>
            <p className="text-slate-600 mb-6">
              Please return to the search page to select a property.
            </p>
            <button
              onClick={() => setCurrentPage("search")}
              className="bg-coral-600 text-white px-6 py-2 rounded hover:bg-coral-700"
            >
              Back to Search
            </button>
          </div>
        </div>
      );
    }

    const property = selectedProperty;
    const images = property.photos || [property.image];
    const agent = users.find((u) => u.id === property.agentId);
    const hasDocuments = documents.some(
      (doc) => doc.propertyId === property.id
    );

    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow mb-8 overflow-hidden">
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={property.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (currentImageIndex - 1 + images.length) % images.length
                      )
                    }
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (currentImageIndex + 1) % images.length
                      )
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-4">
                      {property.address}
                    </h1>
                    <p className="text-4xl font-bold text-coral-600 mb-4">
                      ${property.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSaveProperty(property.id)}
                    className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200"
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        savedProperties.includes(property.id)
                          ? "fill-current text-coral-500"
                          : "text-slate-600"
                      }`}
                    />
                    <span className="text-slate-700 font-medium">
                      {savedProperties.includes(property.id) ? "Saved" : "Save"}
                    </span>
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <Bed className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <div className="font-semibold">{property.beds}</div>
                    <div className="text-sm text-slate-600">Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <Bath className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <div className="font-semibold">{property.baths}</div>
                    <div className="text-sm text-slate-600">Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <Square className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <div className="font-semibold">{property.sqft}</div>
                    <div className="text-sm text-slate-600">Sq Ft</div>
                  </div>
                  <div className="text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <div className="font-semibold">Prime</div>
                    <div className="text-sm text-slate-600">Location</div>
                  </div>
                </div>
                <p className="text-slate-600">{property.description}</p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 border-t pt-6">
                      Location
                    </h3>
                    <div className="h-64 bg-slate-200 rounded-lg overflow-hidden">
                      <img
                        src={`https://placehold.co/800x400/e2e8f0/64748b?text=Map+of\\n${property.location.replace(
                          /\s/g,
                          "+"
                        )}`}
                        alt={`Map of ${property.location}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-0 md:mt-12">
                    <MortgageCalculator price={property.price} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Listing Agent</h3>
                <div className="flex items-center mb-4">
                  <img
                    src={agent?.photo}
                    alt={agent?.name}
                    className="w-16 h-16 rounded-full mr-4 flex-shrink-0 object-cover"
                  />
                  <div>
                    <button
                      onClick={() => {
                        setSelectedAgentId(property.agentId);
                        setCurrentPage("agent-profile");
                      }}
                      className="font-semibold text-coral-600 hover:underline"
                    >
                      {property.agent}
                    </button>
                    <div className="text-slate-600 text-sm">
                      {agent?.brokerage}
                    </div>
                    {agent?.dreLicense && (
                      <div className="text-slate-500 text-xs mt-1">
                        DRE #: {agent.dreLicense}
                      </div>
                    )}
                  </div>
                </div>
                <button className="w-full bg-coral-600 text-white py-2 rounded hover:bg-coral-700 mb-2">
                  Contact Agent
                </button>
                <button
                  onClick={() => {
                    setSelectedAgentId(property.agentId);
                    setCurrentPage("agent-profile");
                  }}
                  className="w-full bg-slate-200 text-slate-700 py-2 rounded hover:bg-slate-300"
                >
                  View Full Profile
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Buyer Incentives</h3>
                <div className="text-center">
                  {property.offerIncentive ? (
                    <div className="bg-coral-600 text-white p-6 rounded-lg text-center">
                      <h4 className="text-2xl font-bold">
                        Seller offering buyer incentives!
                      </h4>
                      <button
                        onClick={() =>
                          showSuccess(
                            "Your inquiry has been sent to the agent."
                          )
                        }
                        className="mt-4 w-full bg-white text-coral-600 font-bold py-2 px-4 rounded-lg hover:bg-coral-100 transition-colors"
                      >
                        Inquire Now
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-600 mb-4 text-sm">
                        The seller is not offering any incentives at this time,
                        but all offers are welcome.
                      </p>
                      <button
                        onClick={() =>
                          showSuccess(
                            "Your inquiry has been sent to the agent."
                          )
                        }
                        className="w-full bg-coral-600 text-white py-2 rounded hover:bg-coral-700"
                      >
                        Contact Agent
                      </button>
                    </>
                  )}
                </div>
              </div>

              {hasDocuments ? (
                <div
                  onClick={() => {
                    setSelectedProperty(property);
                    setCurrentPage("document-package");
                  }}
                  className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Property Documents
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Property disclosures and documents are available for review.
                  </p>
                  <div className="w-full bg-coral-600 text-white py-2 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Review Documents
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Property Documents
                  </h3>
                  <p className="text-slate-600 mb-4">
                    No documents have been uploaded for this property at this
                    time.
                  </p>
                  <button
                    disabled
                    className="w-full bg-slate-200 text-slate-500 py-2 rounded flex items-center justify-center cursor-not-allowed"
                  >
                    Not Available
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 bg-slate-100 border border-slate-300 rounded-lg p-4">
            <p className="text-sm text-slate-600">
              <Shield className="w-4 h-4 inline mr-2" />
              Commission rates are negotiable and not set by this platform.
              Buyer incentives are voluntary offerings by property sellers, and
              are not required to advertise on this platform.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Simple pages
  const LoginPage = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login to Equatere
        </h1>
        <p className="text-slate-600 mb-4 text-center">
          Use the demo bar above to instantly access dashboards!
        </p>
        <button
          onClick={() => setCurrentPage("home")}
          className="w-full bg-coral-600 text-white py-2 rounded hover:bg-coral-700"
        >
          Return Home
        </button>
      </div>
    </div>
  );

  const RegisterPage = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Join Equatere</h1>
        <p className="text-slate-600 mb-4 text-center">
          Use the demo bar above to instantly access dashboards!
        </p>
        <button
          onClick={() => setCurrentPage("home")}
          className="w-full bg-coral-600 text-white py-2 rounded hover:bg-coral-700"
        >
          Return Home
        </button>
      </div>
    </div>
  );

  const LandingPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to Equatere
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8">
            The Future of Real Estate is Here
          </p>
          <button
            onClick={() => setCurrentPage("pricing")}
            className="bg-coral-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-coral-700"
          >
            Get Started Today
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-coral-500" />
            <h3 className="text-2xl font-bold mb-4">Available to all</h3>
            <p className="text-slate-300">
              Industry pro, FSBO, Buyer or Investor this is for you
            </p>
          </div>
          <div className="text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-coral-500" />
            <h3 className="text-2xl font-bold mb-4">Secure Documents</h3>
            <p className="text-slate-300">
              Advanced document vault with controlled access for property
              disclosures
            </p>
          </div>
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-coral-500" />
            <h3 className="text-2xl font-bold mb-4">Easy to use</h3>
            <p className="text-slate-300">
              Marketing tools to help you sell quickly and efficiently
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const PricingPage = () => (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-slate-600">
            Flexible pricing for every type of user
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-4">Free</h3>
            <div className="text-4xl font-bold mb-6">
              $0<span className="text-lg text-slate-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li>✓ Basic listing creation</li>
              <li>✓ Property search</li>
              <li>✓ Basic analytics</li>
              <li className="text-slate-400">✗ Document vault</li>
              <li className="text-slate-400">✗ Marketing tools</li>
            </ul>
            <button className="w-full bg-slate-200 text-slate-700 py-3 rounded-lg">
              Current Plan
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-coral-500 flex flex-col">
            <h3 className="text-2xl font-bold mb-4">Pay Per Listing</h3>
            <div className="text-4xl font-bold mb-6">
              $99<span className="text-lg text-slate-600">/listing</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li>✓ All Free features</li>
              <li>✓ Premium listing placement</li>
              <li>✓ Document vault access</li>
              <li>✓ Basic marketing tools</li>
              <li className="text-slate-400">✗ Advanced analytics</li>
            </ul>
            <button className="w-full bg-coral-600 text-white py-3 rounded-lg hover:bg-coral-700">
              Get Started
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-4">Pro Agent</h3>
            <div className="text-4xl font-bold mb-6">
              $299<span className="text-lg text-slate-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li>✓ Everything included</li>
              <li>✓ Unlimited listings</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Full marketing suite</li>
              <li>✓ Priority support</li>
            </ul>
            <button className="w-full bg-coral-600 text-white py-3 rounded-lg hover:bg-coral-700">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DocumentPackagePage = () => {
    // FIX: Add a guard clause to prevent crashing if no property is selected.
    if (!selectedProperty) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h1 className="text-2xl font-bold mb-4">No Property Selected</h1>
            <p className="text-slate-600 mb-6">
              Please return to the search page to select a property.
            </p>
            <button
              onClick={() => setCurrentPage("search")}
              className="mt-6 bg-coral-600 text-white px-4 py-2 rounded hover:bg-coral-700"
            >
              Back to Search
            </button>
          </div>
        </div>
      );
    }

    useEffect(() => {
      setDocumentActivity((prev) => [
        ...prev,
        {
          id: generateId(),
          propertyId: selectedProperty.id,
          viewer: currentUser.name,
          action: "Viewed Package",
          timestamp: new Date(),
        },
      ]);
    }, [selectedProperty.id]); // Added dependency to avoid stale closures

    const propertyDocs = documents.filter(
      (d) => d.propertyId === selectedProperty.id
    );

    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold mb-2">Disclosure Package</h1>
            <p className="text-slate-600 mb-6">
              for {selectedProperty.address}
            </p>

            <div className="space-y-4">
              {propertyDocs.map((doc) => {
                const isSecureGuest =
                  doc.access === "secure" && currentUser.role === "guest";
                return (
                  <div
                    key={doc.id}
                    className={`border rounded-lg p-4 flex items-center justify-between ${
                      isSecureGuest ? "bg-slate-100" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <FileText
                        className={`w-5 h-5 mr-3 ${
                          isSecureGuest ? "text-slate-400" : "text-coral-600"
                        }`}
                      />
                      <div>
                        <h3
                          className={`font-semibold ${
                            isSecureGuest ? "text-slate-500" : ""
                          }`}
                        >
                          {doc.name}
                        </h3>
                        {isSecureGuest && (
                          <p className="text-xs text-yellow-600">
                            Requires agent approval to view
                          </p>
                        )}
                      </div>
                    </div>
                    {isSecureGuest ? (
                      <button
                        onClick={() => showSuccess("Request sent!")}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 flex items-center"
                      >
                        <Lock size={12} className="mr-1" /> Request Access
                      </button>
                    ) : (
                      <button className="bg-slate-200 text-slate-700 px-3 py-1 rounded text-sm hover:bg-slate-300">
                        View
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-slate-100 rounded-lg">
              <p className="text-sm text-slate-600">
                Documents provided by {selectedProperty.agent}. Please review
                all documents carefully with your representative.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ShareModal = () => {
    if (!showShareModal || !selectedPropertyForSharing) return null;
    const [permission, setPermission] = useState("public");
    const link = `https://equatere.com/p/${selectedPropertyForSharing.id}/docs?access=${permission}`;

    const handleCopy = () => {
      const textarea = document.createElement("textarea");
      textarea.value = link;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showSuccess("Link copied to clipboard!");
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Share Document Package</h2>
            <button onClick={() => setShowShareModal(false)}>
              <X size={24} />
            </button>
          </div>
          <p className="text-slate-600 mb-4">
            Share all documents for "{selectedPropertyForSharing.address}".
          </p>

          <div className="space-y-4">
            <div>
              <label className="font-medium">Link Permission</label>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"
              >
                <option value="public">
                  Public (Anyone with the link can view)
                </option>
                <option value="secure">
                  Secure (Requires agent approval for guests)
                </option>
              </select>
            </div>
            <div>
              <label className="font-medium">Shareable Link</label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="text"
                  readOnly
                  value={link}
                  className="flex-grow p-2 border bg-slate-100 border-slate-300 rounded-md"
                />
                <button
                  onClick={handleCopy}
                  className="bg-coral-600 text-white px-4 py-2 rounded hover:bg-coral-700"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AgentProfilePage = () => {
    const agent = users.find((u) => u.id === selectedAgentId);
    const agentListings = listings.filter((l) => l.agentId === selectedAgentId);
    const [agentPhoto, setAgentPhoto] = useState(
      agent?.photo || "https://placehold.co/200x200/cccccc/666666?text=Agent"
    );

    const handlePhotoUpload = () => {
      const newPhoto = prompt(
        "Enter new photo URL:",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop"
      );
      if (newPhoto) {
        setAgentPhoto(newPhoto);
        // In a real app, you'd update the main users state
        showSuccess("Profile photo updated!");
      }
    };

    if (!agent) {
      return <div className="p-8">Agent not found.</div>;
    }

    return (
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
              <div className="relative mb-4 md:mb-0 md:mr-8">
                <img
                  src={agentPhoto}
                  alt={agent.name}
                  className="w-40 h-40 rounded-full object-cover ring-4 ring-coral-500"
                />
                {currentUser.id === agent.id && (
                  <button
                    onClick={handlePhotoUpload}
                    className="absolute bottom-0 right-2 bg-coral-600 text-white p-2 rounded-full hover:bg-coral-700"
                  >
                    <Upload size={16} />
                  </button>
                )}
              </div>
              <div className="flex-grow">
                <h1 className="text-4xl font-bold">{agent.name}</h1>
                <p className="text-xl text-slate-600 mt-1">{agent.brokerage}</p>
                <div className="mt-4 flex justify-center md:justify-start space-x-2">
                  <button className="bg-coral-600 text-white px-4 py-2 rounded-md hover:bg-coral-700 flex items-center">
                    <Mail size={16} className="mr-2" /> Contact
                  </button>
                  <button className="bg-slate-200 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-300 flex items-center">
                    <Phone size={16} className="mr-2" /> Call
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t my-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h2 className="text-2xl font-bold mb-4">Agent Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Briefcase size={16} className="mr-3 text-slate-500" />
                    <span>{agent.brokerage}</span>
                  </div>
                  <div className="flex items-center">
                    <Shield size={16} className="mr-3 text-slate-500" />
                    <span>DRE #: {agent.dreLicense}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail size={16} className="mr-3 text-slate-500" />
                    <span>{agent.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className="mr-3 text-slate-500" />
                    <span>{agent.phone}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mt-6 mb-2">My Services</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {agent.services?.map((service) => (
                    <li key={service} className="flex items-center">
                      <CheckCircle size={14} className="mr-2 text-green-500" />
                      {service}
                    </li>
                  ))}
                </ul>
                <h3 className="text-xl font-bold mt-6 mb-2">
                  Commission Structure
                </h3>
                <p className="text-sm text-slate-600">
                  {agent.commissionStructure}
                </p>
              </div>
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-4">
                  About {agent.name.split(" ")[0]}
                </h2>
                <p className="text-slate-600 leading-relaxed">{agent.bio}</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">
              Active Listings ({agentListings.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {agentListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {listing.address}
                    </h3>
                    <p className="text-2xl font-bold text-coral-600 mb-2">
                      ${listing.price.toLocaleString()}
                    </p>
                    <p className="text-slate-600 mb-4">{listing.location}</p>
                    <button
                      onClick={() => {
                        setSelectedProperty(listing);
                        setCurrentImageIndex(0);
                        setCurrentPage("property-details");
                      }}
                      className="w-full bg-slate-700 text-white py-2 rounded hover:bg-slate-600"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render function
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <Homepage />;
      case "search":
        return <SearchPage />;
      case "property-details":
        return <PropertyDetails />;
      case "dashboard":
        return <Dashboard />;
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      case "landing":
        return <LandingPage />;
      case "pricing":
        return <PricingPage />;
      case "document-package":
        return <DocumentPackagePage />;
      case "agent-profile":
        return <AgentProfilePage />;
      default:
        return <Homepage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Train+One&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Roboto:wght@400;700&family=Roboto+Mono&family=Playfair+Display:wght@700&family=Montserrat:wght@400;700&family=Roboto+Slab:wght@400;700&family=Lato:wght@400;700&family=Oswald:wght@400;700&family=Lobster&family=Source+Code+Pro&display=swap');

                body { font-family: 'Inter', sans-serif; }
                .font-logo { font-family: 'Train One', cursive; }
                .font-sans { font-family: 'Lato', sans-serif; }
                .font-serif { font-family: 'Lora', serif; }
                .font-playfair { font-family: 'Playfair Display', serif; }
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                .font-roboto-slab { font-family: 'Roboto Slab', serif; }
                .font-lato { font-family: 'Lato', sans-serif; }
                .font-oswald { font-family: 'Oswald', sans-serif; }
                .font-lobster { font-family: 'Lobster', cursive; }
                .font-source-code { font-family: 'Source Code Pro', monospace; }
                
                .text-coral-400 { color: #fb923c; }
                .text-coral-500 { color: #f97316; }
                .text-coral-600 { color: #ea580c; }
                .text-coral-700 { color: #c2410c; }
                
                .bg-coral-50 { background-color: #fff7ed; }
                .bg-coral-500 { background-color: #f97316; }
                .bg-coral-600 { background-color: #ea580c; }
                .bg-coral-700 { background-color: #c2410c; }
                
                .hover\\:bg-coral-700:hover { background-color: #c2410c; }
                .hover\\:text-coral-400:hover { color: #fb923c; }
                .hover\\:text-coral-700:hover { color: #c2410c; }

                .border-coral-500 { border-color: #f97316; }
                .hover\\:border-coral-400:hover { border-color: #fb923c; }
                .hover\\:border-coral-500:hover { border-color: #f97316; }

                .ring-coral-500 { --tw-ring-color: #f97316; }
                .peer:focus {
                    --tw-ring-color: #fb923c; /* coral-400 */
                }
                
                /* Custom range input styles */
               input[type=range] {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 8px;
                background: #e2e8f0; /* bg-slate-200 */
                border-radius: 9999px;
                outline: none;
               }
               input[type=range]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                background: #ea580c; /* bg-coral-600 */
                cursor: pointer;
                border-radius: 50%;
               }
               input[type=range]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: #ea580c; /* bg-coral-600 */
                cursor: pointer;
                border-radius: 50%;
                border: none;
               }

                @keyframes fade-in-down {
                    0% {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.5s ease-out forwards;
                }
            `}</style>
      <Navigation />
      <Notification />
      <ShareModal />
      <main>{renderCurrentPage()}</main>
    </div>
  );
};

export default App;
