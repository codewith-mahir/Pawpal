import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [donations, setDonations] = useState([]);
  const [analytics, setAnalytics] = useState({ mostSoldBreed: [], mostViewedCategories: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState({ users: '', products: '', complaints: '' });
  const [donationQuery, setDonationQuery] = useState('');
  const [page, setPage] = useState({ users: 1, products: 1, complaints: 1 });
  const [total, setTotal] = useState({ users: 0, products: 0, complaints: 0 });
  const limit = 20;

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'complaints') fetchComplaints();
    if (activeTab === 'analytics') fetchAnalytics();
  if (activeTab === 'donations') fetchDonations();
  }, [activeTab, page.users, page.products, page.complaints]);

  async function fetchUsers() {
    try { setLoading(true); setError('');
      const res = await axios.get('/admin/users', { params: { page: page.users, limit, q: search.users } });
      setUsers(res.data.data); setTotal((t)=> ({...t, users: res.data.total}));
    } catch (e) { setError('Failed to load users'); }
    finally { setLoading(false); }
  }
  async function fetchProducts() {
    try { setLoading(true); setError('');
      const res = await axios.get('/admin/products', { params: { page: page.products, limit, q: search.products } });
      setProducts(res.data.data); setTotal((t)=> ({...t, products: res.data.total}));
    } catch (e) { setError('Failed to load products'); }
    finally { setLoading(false); }
  }
  async function fetchComplaints() {
    try { setLoading(true); setError('');
      const res = await axios.get('/admin/complaints', { params: { page: page.complaints, limit, q: search.complaints } });
      setComplaints(res.data.data); setTotal((t)=> ({...t, complaints: res.data.total}));
    } catch (e) { setError('Failed to load complaints'); }
    finally { setLoading(false); }
  }
  async function fetchAnalytics() {
    try { setLoading(true); setError('');
      const res = await axios.get('/admin/analytics');
      setAnalytics(res.data);
    } catch (e) { setError('Failed to load analytics'); }
    finally { setLoading(false); }
  }

  async function fetchDonations() {
    try { setLoading(true); setError('');
      const res = await axios.get('/donations');
      setDonations(res.data || []);
    } catch (e) { setError('Failed to load donations'); }
    finally { setLoading(false); }
  }

  async function promoteUser(id) {
    try {
      await axios.post(`/admin/promote/${id}`);
  toast.success('User promoted to admin');
  fetchUsers();
    } catch (err) {
  toast.error('Failed to promote user');
    }
  }

  async function deleteUser(id) {
    if (!window.confirm('Are you sure you want to delete this user? This will remove their products too.')) return;
    try {
      await axios.delete(`/admin/user/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  }

  async function setBlocked(id, blocked) {
    try {
      await axios.post(`/admin/user/${id}/block`, { blocked });
      toast.success(blocked ? 'User blocked & banned' : 'User unblocked & unbanned');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update block status');
    }
  }

  async function setApproved(id, approved) {
    try {
      await axios.post(`/admin/user/${id}/approve`, { approved });
      toast.success(approved ? 'User approved' : 'User unapproved (email freed)');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update approval');
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/admin/product/${id}`);
      alert('Product deleted');
  fetchUsers();
    } catch (err) {
      alert('Failed to delete product');
    }
  }

  return (
    <Container maxWidth="lg" sx={{ my: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Admin Dashboard</Typography>
      {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 2 }}
        variant="scrollable"
      >
        <Tab value="users" label="Users" />
        <Tab value="products" label="Products" />
        <Tab value="complaints" label="Complaints" />
  <Tab value="donations" label="Donations" />
        <Tab value="analytics" label="Analytics" />
      </Tabs>

      {activeTab !== 'analytics' && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder={`Search ${activeTab}...`}
            value={search[activeTab]}
            onChange={(e)=> setSearch((s)=> ({ ...s, [activeTab]: e.target.value }))}
            onKeyDown={(e)=> { if (e.key==='Enter') { if (activeTab==='users') { setPage((p)=> ({...p, users:1})); fetchUsers(); } if (activeTab==='products') { setPage((p)=> ({...p, products:1})); fetchProducts(); } if (activeTab==='complaints') { setPage((p)=> ({...p, complaints:1})); fetchComplaints(); } } }}
            sx={{ width: 320 }}
          />
          <Button variant="outlined" onClick={()=> { if (activeTab==='users') { setPage((p)=> ({...p, users:1})); fetchUsers(); } if (activeTab==='products') { setPage((p)=> ({...p, products:1})); fetchProducts(); } if (activeTab==='complaints') { setPage((p)=> ({...p, complaints:1})); fetchComplaints(); } }}>Search</Button>
        </Box>
      )}

      {activeTab === 'users' && (
        <>
          <Typography variant="h6" sx={{ mb: 1 }}>Users</Typography>
          {loading ? (
            <Grid container spacing={2}>{Array.from({length:8}).map((_,i)=> (
              <Grid item xs={12} md={6} key={i}><Card><CardContent><Skeleton height={28} width="60%" /><Skeleton height={20} width="80%" /></CardContent></Card></Grid>
            ))}</Grid>
          ) : (
            <Grid container spacing={2}>
              {(users || []).map((u) => (
                <Grid item xs={12} md={6} key={u._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1">{u.name} <Typography component="span" variant="body2" color="text.secondary">({u.email})</Typography></Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip label={`Role: ${u.role}`} size="small" />
                        <Chip label={u.isBlocked ? 'Blocked' : 'Active'} color={u.isBlocked ? 'error' : 'success'} size="small" />
                        <Chip label={u.isApproved === false ? 'Unapproved' : 'Approved'} color={u.isApproved === false ? 'warning' : 'primary'} size="small" />
                      </Stack>
                    </CardContent>
                    <CardActions>
                      {u.role !== 'admin' && (
                        <Button size="small" onClick={() => promoteUser(u._id)}>Promote</Button>
                      )}
                      {u.role !== 'admin' && (
                        <Button size="small" color={u.isBlocked ? 'success' : 'error'} onClick={() => setBlocked(u._id, !(u.isBlocked || false))}>
                          {u.isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                      )}
                      {u.role !== 'admin' && (
                        <Button size="small" color="warning" onClick={() => setApproved(u._id, false)}>Unapprove</Button>
                      )}
                      {u.role !== 'admin' && (
                        <Button size="small" color="error" onClick={() => deleteUser(u._id)}>Delete</Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Pager total={total.users} page={page.users} limit={limit} onChange={(p)=> setPage((x)=> ({...x, users:p}))} />
        </>
      )}

      {activeTab === 'products' && (
        <>
          <Typography variant="h6" sx={{ mb: 1 }}>Products</Typography>
          {loading ? (
            <Grid container spacing={2}>{Array.from({length:8}).map((_,i)=> (
              <Grid item xs={12} md={6} key={i}><Card><CardContent><Skeleton height={28} width="60%" /><Skeleton height={20} width="80%" /></CardContent></Card></Grid>
            ))}</Grid>
          ) : (
            <Grid container spacing={2}>
              {(products || []).map((p) => (
                <Grid item xs={12} md={6} key={p._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1">{p.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Amount: {p.amount} Taka</Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip label={`Category: ${p.category || p.aiCategory || 'General'}`} size="small" />
                        <Chip label={`Breed: ${p.breed || 'N/A'}`} size="small" />
                        <Chip label={`Views: ${p.viewCount || 0}`} size="small" />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>Seller: {p.sellerId?.name || 'Unknown'}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="error" onClick={() => deleteProduct(p._id)}>Delete</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Pager total={total.products} page={page.products} limit={limit} onChange={(p)=> setPage((x)=> ({...x, products:p}))} />
        </>
      )}

      {activeTab === 'complaints' && (
        <>
          <Typography variant="h6" sx={{ mb: 1 }}>Complaints</Typography>
          {loading ? (
            <Grid container spacing={2}>{Array.from({length:8}).map((_,i)=> (
              <Grid item xs={12} key={i}><Card><CardContent><Skeleton height={20} width="90%" /></CardContent></Card></Grid>
            ))}</Grid>
          ) : (
            <Grid container spacing={2}>
              {(complaints || []).map((c) => (
                <Grid item xs={12} key={c._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" sx={{ mb: 1 }}>From: {c.userId?.name || 'Unknown'} ({c.userId?.email || 'No email'})</Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        {c.productId && <Chip label={`Product: ${c.productId?.name || c.productId}`} size="small" />}
                        {c.orderId && <Chip label={`Order: ${c.orderId?._id || c.orderId}`} size="small" />}
                        <Chip label={`Status: ${c.status || 'open'}`} size="small" />
                      </Stack>
                      <Typography variant="body1" sx={{ mb: 1 }}>{c.message}</Typography>
                      {c.proofUrl && (
                        <Typography variant="caption"><a href={`/${c.proofUrl}`} target="_blank" rel="noreferrer">View proof</a></Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={async ()=> { await axios.patch(`/complaints/${c._id}`, { status: 'in-progress' }); toast.success('Marked in-progress'); fetchComplaints(); }}>Mark In-Progress</Button>
                      <Button size="small" onClick={async ()=> { await axios.patch(`/complaints/${c._id}`, { status: 'resolved' }); toast.success('Marked resolved'); fetchComplaints(); }}>Resolve</Button>
                      <Button size="small" onClick={async ()=> { const reply = prompt('Reply to user:'); if (reply!=null) { await axios.patch(`/complaints/${c._id}`, { adminReply: reply }); toast.success('Reply saved'); fetchComplaints(); } }}>Reply</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Pager total={total.complaints} page={page.complaints} limit={limit} onChange={(p)=> setPage((x)=> ({...x, complaints:p}))} />
        </>
      )}

      {activeTab === 'analytics' && (
        <>
          <Typography variant="h6" sx={{ mb: 1 }}>Analytics</Typography>
          {loading ? (
            <Skeleton height={40} />
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Most Sold Breeds</Typography>
                    {(analytics.mostSoldBreed || []).map((b) => (
                      <Typography key={b.breed} variant="body2">{b.breed} — {b.count}</Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Most Viewed Categories</Typography>
                    {(analytics.mostViewedCategories || []).map((c) => (
                      <Typography key={c.category} variant="body2">{c.category} — {c.totalViews}</Typography>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}

      {activeTab === 'donations' && (
        <>
          <Typography variant="h6" sx={{ mb: 1 }}>Donations</Typography>
          {/* Donations summary + filter */}
          <Box sx={{ mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, alignItems: { xs: 'stretch', sm: 'center' } }}>
            <TextField
              size="small"
              placeholder="Filter by user, email, NGO, item..."
              value={donationQuery}
              onChange={(e)=> setDonationQuery(e.target.value)}
              sx={{ width: { xs: '100%', sm: 360 } }}
            />
            {/* Summary chips */}
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Chip label={`Total donations: ${(donations || []).length}`} size="small" />
              <Chip label={`Total items: ${(donations || []).reduce((acc,d)=> acc + (Array.isArray(d.items)? d.items.length:0), 0)}`} size="small" />
              <Chip label={`Unique donors: ${new Set((donations || []).map(d=> d.userId?._id || d.userId)).size}`} size="small" />
            </Stack>
          </Box>
          {/* Per-NGO totals */}
          {Array.isArray(donations) && donations.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Totals by Donation Type</Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {Object.entries(
                  donations.reduce((m,d)=>{
                    const key = d.isWebsiteDonation ? 'PetAdopt Website' : (d.selectedNgo || d.ngoId?.name || 'Unknown NGO');
                    const count = d.isWebsiteDonation ? 1 : (Array.isArray(d.items) ? d.items.length : 1);
                    m[key] = m[key] ? { donations: m[key].donations + 1, items: m[key].items + count } : { donations: 1, items: count };
                    return m;
                  }, {})
                ).map(([org, val])=> (
                  <Chip key={org} size="small" label={`${org}: ${val.donations} donations`} />
                ))}
              </Stack>
            </Box>
          )}
          {loading ? (
            <Grid container spacing={2}>{Array.from({length:8}).map((_,i)=> (
              <Grid item xs={12} key={i}><Card><CardContent><Skeleton height={20} width="90%" /></CardContent></Card></Grid>
            ))}</Grid>
          ) : (
            <Grid container spacing={2}>
              {(donations || [])
                .filter(d => {
                  if (!donationQuery.trim()) return true;
                  const q = donationQuery.toLowerCase();
                  const hay = [
                    d.firstName,
                    d.lastName,
                    d.email,
                    d.userId?.name,
                    d.userId?.email,
                    d.selectedNgo,
                    d.ngoId?.name,
                    d.donationItems,
                    d.donationAmount,
                    d.other,
                    ...(Array.isArray(d.items)? d.items: [])
                  ].filter(Boolean).join(' ').toLowerCase();
                  return hay.includes(q);
                })
                .map((d) => (
                <Grid item xs={12} key={d._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                        From: {d.firstName && d.lastName ? `${d.firstName} ${d.lastName}` : (d.userId?.name || 'Unknown')} 
                        ({d.email || d.userId?.email || ''})
                      </Typography>
                      
                      {/* Show website donation or NGO donation */}
                      {d.isWebsiteDonation || d.donationType === 'website' ? (
                        <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 600 }}>
                          💝 Website Support Donation
                        </Typography>
                      ) : (
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          🏠 NGO: {d.selectedNgo || d.ngoId?.name || 'Unknown NGO'}
                        </Typography>
                      )}
                      
                      {/* Show donation details */}
                      {d.donationItems && (
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Donation Type:</strong> {d.donationItems.charAt(0).toUpperCase() + d.donationItems.slice(1)}
                        </Typography>
                      )}
                      
                      {d.donationAmount && (
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Amount:</strong> ৳{d.donationAmount}
                        </Typography>
                      )}
                      
                      {d.other && (
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Details:</strong> {d.other}
                        </Typography>
                      )}
                      
                      {/* Legacy items display */}
                      {Array.isArray(d.items) && d.items.length > 0 && (
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Items:</strong> {d.items.join(', ')} ({d.items.length} items)
                        </Typography>
                      )}
                      
                      {d.deliveryMethod && (
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <strong>Delivery:</strong> {d.deliveryMethod}
                        </Typography>
                      )}
                      
                      {d.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <strong>Notes:</strong> {d.notes}
                        </Typography>
                      )}
                      
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        Requested: {d.createdAt ? new Date(d.createdAt).toLocaleString() : ''}
                      </Typography>
                      
                      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`Status: ${d.status}`} 
                          size="small" 
                          color={d.status === 'approved' ? 'success' : d.status === 'rejected' ? 'error' : 'default'}
                        />
                        {d.scheduledAt && (
                          <Chip label={`Scheduled: ${new Date(d.scheduledAt).toLocaleDateString()}`} size="small" />
                        )}
                        {d.confirmedAt && (
                          <Chip label={`Confirmed: ${new Date(d.confirmedAt).toLocaleDateString()}`} size="small" color="success" />
                        )}
                        <Chip 
                          label={d.isWebsiteDonation ? 'Website Support' : 'NGO Donation'} 
                          size="small" 
                          variant="outlined"
                          color={d.isWebsiteDonation ? 'primary' : 'secondary'}
                        />
                      </Stack>
                    </CardContent>
                    <CardActions>
                      {d.status === 'pending' && (
                        <>
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="success"
                            onClick={async ()=> { 
                              await axios.patch(`/donations/${d._id}`, { status: 'approved' }); 
                              toast.success('Donation approved'); 
                              fetchDonations(); 
                            }}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error"
                            onClick={async ()=> { 
                              const note = prompt('Reason for rejection (optional):'); 
                              await axios.patch(`/donations/${d._id}`, { status: 'rejected', adminComment: note || '' }); 
                              toast.success('Donation rejected'); 
                              fetchDonations(); 
                            }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {d.status === 'approved' && (
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="primary"
                          onClick={async ()=> { 
                            await axios.patch(`/donations/${d._id}`, { status: 'completed' }); 
                            toast.success('Marked as completed'); 
                            fetchDonations(); 
                          }}
                        >
                          Mark Completed
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
}

function Pager({ total, page, limit, onChange }) {
  const pages = Math.max(Math.ceil((total || 0) / (limit || 20)), 1);
  if (pages <= 1) return null;
  const prev = Math.max(page - 1, 1);
  const next = Math.min(page + 1, pages);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
      <button disabled={page<=1} onClick={()=> onChange(prev)}>Prev</button>
      <span>Page {page} of {pages}</span>
      <button disabled={page>=pages} onClick={()=> onChange(next)}>Next</button>
    </div>
  );
}
