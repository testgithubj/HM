/* eslint-disable prettier/prettier */
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fade,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';

const ShowService = ({ open, handleClose, data }) => {
  const theme = useTheme();

  if (!data) return null;

  // Format duration to hours and minutes
  const formatDuration = (minutes) => {
    if (!minutes) return '0 min';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="show-service-dialog-title"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          overflow: 'hidden'
        }
      }}
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      <DialogTitle
        id="show-service-dialog-title"
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
          py: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
          Service Details
        </Typography>
        <Tooltip title="Close">
          <IconButton onClick={handleClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Service Name Header */}
        <Box
          sx={{
            p: 3,
            backgroundColor: theme.palette.grey[50],
            borderBottom: `1px solid ${theme.palette.grey[200]}`
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 1,
              color: theme.palette.primary.dark
            }}
          >
            {data.name || 'Unnamed Service'}
          </Typography>
        </Box>

        {/* Service Details */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Category */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.grey[200]}`,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Avatar sx={{ bgcolor: theme.palette.secondary.light }}>
                  <CategoryIcon sx={{ color: theme.palette.secondary.dark }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Category
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {data.category || 'Not specified'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Price and Duration */}
            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.grey[200]}`,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  height: '100%'
                }}
              >
                <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                  <AttachMoneyIcon sx={{ color: theme.palette.success.dark }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Price
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    ${data.price?.toFixed(2) ?? '0.00'}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.grey[200]}`,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  height: '100%'
                }}
              >
                <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                  <AccessTimeIcon sx={{ color: theme.palette.info.dark }} />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Duration
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDuration(data.duration)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Chip label="Description" icon={<DescriptionIcon />} color="primary" variant="outlined" size="small" />
              </Divider>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mt: 2,
                  backgroundColor: theme.palette.grey[50],
                  border: `1px solid ${theme.palette.grey[200]}`,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  borderRadius: 2
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    color: theme.palette.text.primary,
                    lineHeight: 1.6,
                    maxWidth: '100%',
                    wordWrap: 'break-word'
                  }}
                >
                  {data.description || 'No description available for this service.'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.grey[50],
          justifyContent: 'center'
        }}
      >
        <Button
          onClick={handleClose}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontWeight: 'bold'
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ShowService.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  data: PropTypes.object
};

export default ShowService;
