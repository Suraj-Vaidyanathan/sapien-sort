
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LayoutDashboard, Bot, Package, Settings } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: LayoutDashboard,
      title: 'Real-time Overview',
      description: 'Monitor your entire robotic sorting system at a glance',
      link: '/overview',
    },
    {
      icon: Bot,
      title: 'Robot Management',
      description: 'Track robot positions, battery levels, and status',
      link: '/overview',
    },
    {
      icon: Package,
      title: 'Package Tracking',
      description: 'Follow packages through the sorting process',
      link: '/overview',
    },
    {
      icon: Settings,
      title: 'System Configuration',
      description: 'Configure robots, bins, and system parameters',
      link: '/settings',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            RoboSort Control System
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Advanced monitoring and control system for robotic package sorting operations. 
            Track packages, monitor robots, and manage your automated warehouse in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/overview">
              <Button size="lg" className="w-full sm:w-auto">
                <LayoutDashboard className="w-5 h-5 mr-2" />
                View System Overview
              </Button>
            </Link>
            
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Settings className="w-5 h-5 mr-2" />
              System Settings
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link}>
              <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">System Uptime</p>
                <p className="text-2xl font-bold text-green-800">99.8%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Packages Today</p>
                <p className="text-2xl font-bold text-blue-800">1,247</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Active Robots</p>
                <p className="text-2xl font-bold text-purple-800">4/4</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
