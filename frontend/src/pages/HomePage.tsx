import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { Eye, Heart, Bookmark, Code, ArrowRight, TrendingUp, Clock, Star } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <section className="bg-gradient-to-b from-atlas-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
            Explore how real software is <span className="text-atlas-600">designed, built, deployed, and learned from</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            BuildAtlas shows the complete engineering story behind software projects — not just the code, but the decisions, problems, and lessons learned.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/discover" className="btn-primary text-lg px-8 py-3">Explore Projects</Link>
            {!user && <Link to="/register" className="btn-secondary text-lg px-8 py-3">Start Documenting</Link>}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-atlas-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Code className="w-6 h-6 text-atlas-600" /></div>
              <h3 className="text-lg font-semibold mb-2">Architecture Documentation</h3>
              <p className="text-gray-600">Create interactive architecture diagrams and document system design decisions.</p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-atlas-100 rounded-xl flex items-center justify-center mx-auto mb-4"><TrendingUp className="w-6 h-6 text-atlas-600" /></div>
              <h3 className="text-lg font-semibold mb-2">Engineering Decisions</h3>
              <p className="text-gray-600">Document why technologies were chosen, trade-offs considered, and problems solved.</p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-atlas-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Star className="w-6 h-6 text-atlas-600" /></div>
              <h3 className="text-lg font-semibold mb-2">Project Discovery</h3>
              <p className="text-gray-600">Find real projects using specific technologies and study how they were built.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">GitHub shows the code. BuildAtlas shows how the software was built.</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Create a project page that documents everything: architecture, database design, API design, engineering decisions, problems encountered, deployment, and lessons learned.
          </p>
          <Link to="/discover" className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
