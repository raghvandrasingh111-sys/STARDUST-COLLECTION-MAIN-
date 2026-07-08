"use client";

export default function TryAtHomeButton() {
  return (
    <button 
      className="btn-primary"
      onClick={() => alert("Try at home service booking initialized! We will contact you soon.")}
    >
      Book Free Home Trial
    </button>
  );
}
